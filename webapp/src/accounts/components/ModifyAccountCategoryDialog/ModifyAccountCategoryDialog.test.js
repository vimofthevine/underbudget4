import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import renderWithRouter from '../../../tests/renderWithRouter';
import ModifyAccountCategoryDialog from './ModifyAccountCategoryDialog';

const render = (category, code = 200) => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet(`/api/account-categories/${category.id}`).reply(code, category);

  const queryClient = new QueryClient();

  localStorage.setItem('underbudget.selected.ledger', '2');

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/accounts/modify-category/:id' element={<ModifyAccountCategoryDialog />} />
        </Routes>
      </QueryClientProvider>,
      { route: `/accounts/modify-category/${category.id}` },
    ),
    mockAxios,
    queryClient,
  };
};

test('should close dialog when unable to fetch category', async () => {
  const { mockAxios } = render({ id: 3 }, 404);
  await waitFor(() => expect(mockAxios.history.get).toHaveLength(1));
  expect(screen.queryByRole('heading', { name: /modify ledger/i })).not.toBeInTheDocument();
});

test('should prevent submission when required fields are missing', async () => {
  render({ id: 3, name: 'A category', lastUpdated: '' });

  await waitFor(() => expect(screen.getByLabelText(/name/i)).toHaveValue('A category'));

  userEvent.clear(screen.getByLabelText(/name/i));

  const saveButton = screen.getByRole('button', { name: /save/i });
  userEvent.click(saveButton);
  await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());
  expect(saveButton).toBeDisabled();
});

test('should show error message when request error', async () => {
  const { mockAxios } = render({ id: 3, name: 'A category', lastUpdated: '' });
  mockAxios.onPut('/api/account-categories/3').reply(400);

  await waitFor(() => expect(screen.getByLabelText(/name/i)).toHaveValue('A category'));

  userEvent.click(screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByText(/unable to modify account category/i)).toBeInTheDocument(),
  );
});

test('should close and refresh query when successful modify', async () => {
  const { mockAxios, queryClient } = render({ id: 3, name: 'A category', lastUpdated: '' });
  mockAxios.onPut('/api/account-categories/3').reply(200);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  await waitFor(() => expect(screen.getByLabelText(/name/i)).toHaveValue('A category'));

  userEvent.type(screen.getByLabelText(/name/i), '{selectall}my category name');
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify category/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
    name: 'my category name',
  });
  expect(invalidateQueries).toHaveBeenCalledWith([
    'account-categories',
    {
      ledger: '2',
    },
  ]);
});
