import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import renderWithRouter from 'test/renderWithRouter';
import ModifyAccountDialog from '../ModifyAccountDialog';

const render = (account, code = 200) => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet(`/api/accounts/${account.id}`).reply(code, account);
  mockAxios.onGet('/api/ledgers/2/account-categories').reply(200, {
    categories: [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ],
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  localStorage.setItem('underbudget.selected.ledger', '2');

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/accounts/:id/modify' element={<ModifyAccountDialog />} />
        </Routes>
      </QueryClientProvider>,
      { route: `/accounts/${account.id}/modify` },
    ),
    mockAxios,
    queryClient,
  };
};

test('should close dialog when unable to fetch account', async () => {
  const { history } = render({ id: 3 }, 404);
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify account/i })).toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify account/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(history.location.pathname).toBe('/accounts/3'));
});

test('should prevent submission when required fields are missing', async () => {
  render({ id: 3, categoryId: 1, name: 'An account', lastUpdated: '' });

  await waitFor(() => expect(screen.getByLabelText(/^name/i)).toHaveValue('An account'));

  userEvent.clear(screen.getByLabelText(/^name/i));
  userEvent.tab();

  const saveButton = screen.getByRole('button', { name: /save/i });
  userEvent.click(saveButton);
  await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());
  expect(saveButton).toBeDisabled();
});

test('should show error message when request error', async () => {
  const { mockAxios } = render({ id: 3, categoryId: 1, name: 'An account', lastUpdated: '' });
  mockAxios.onPut('/api/accounts/3').reply(400);

  await waitFor(() => expect(screen.getByLabelText(/^name/i)).toHaveValue('An account'));
  userEvent.type(screen.getByLabelText(/^name/i), ' ');

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() => expect(screen.getByText(/unable to modify account/i)).toBeInTheDocument());
});

test('should close and refresh query when successful modify', async () => {
  const { mockAxios, queryClient } = render({
    id: 3,
    categoryId: 1,
    name: 'An account',
    lastUpdated: '',
  });
  mockAxios.onPut('/api/accounts/3').reply(200);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  await waitFor(() => expect(screen.getByLabelText(/^name/i)).toHaveValue('An account'));

  userEvent.type(screen.getByLabelText(/^name/i), '{selectall}my account name');
  userEvent.click(screen.getByRole('button', { name: /open/i }));
  userEvent.click(screen.getByRole('option', { name: 'Category 2' }));
  userEvent.type(screen.getByLabelText(/institution name/i), 'My Bank Name');

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify account/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
    categoryId: 2,
    name: 'my account name',
    institution: 'My Bank Name',
    accountNumber: '',
  });
  expect(invalidateQueries).toHaveBeenCalledWith(['account', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith([
    'account-categories',
    {
      ledger: '2',
    },
  ]);
});
