import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import renderWithRouter from '../../../tests/renderWithRouter';
import ModifyEnvelopeDialog from './ModifyEnvelopeDialog';

const render = (envelope, code = 200) => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet(`/api/envelopes/${envelope.id}`).reply(code, envelope);
  mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(200, {
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
          <Route path='/envelopes/:id/modify' element={<ModifyEnvelopeDialog />} />
        </Routes>
      </QueryClientProvider>,
      { route: `/envelopes/${envelope.id}/modify` },
    ),
    mockAxios,
    queryClient,
  };
};

test('should close dialog when unable to fetch envelope', async () => {
  const { history } = render({ id: 3 }, 404);
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify envelope/i })).toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify envelope/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(history.location.pathname).toBe('/envelopes/3'));
});

test('should prevent submission when required fields are missing', async () => {
  render({ id: 3, categoryId: 1, name: 'An envelope', lastUpdated: '' });

  await waitFor(() => expect(screen.getByLabelText(/^name/i)).toHaveValue('An envelope'));

  userEvent.clear(screen.getByLabelText(/^name/i));

  const saveButton = screen.getByRole('button', { name: /save/i });
  userEvent.click(saveButton);
  await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());
  expect(saveButton).toBeDisabled();
});

test('should show error message when request error', async () => {
  const { mockAxios } = render({ id: 3, categoryId: 1, name: 'An envelope', lastUpdated: '' });
  mockAxios.onPut('/api/envelopes/3').reply(400);

  await waitFor(() => expect(screen.getByLabelText(/^name/i)).toHaveValue('An envelope'));

  userEvent.click(screen.getByRole('button', { name: /save/i }));
  await waitFor(() => expect(screen.getByText(/unable to modify envelope/i)).toBeInTheDocument());
});

test('should close and refresh query when successful modify', async () => {
  const { mockAxios, queryClient } = render({
    id: 3,
    categoryId: 1,
    name: 'An envelope',
    lastUpdated: '',
  });
  mockAxios.onPut('/api/envelopes/3').reply(200);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  await waitFor(() => expect(screen.getByLabelText(/^name/i)).toHaveValue('An envelope'));

  userEvent.type(screen.getByLabelText(/^name/i), '{selectall}my envelope name');
  userEvent.click(screen.getByRole('button', { name: /open/i }));
  userEvent.click(screen.getByRole('option', { name: 'Category 2' }));
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify envelope/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
    categoryId: 2,
    name: 'my envelope name',
  });
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith([
    'envelope-categories',
    {
      ledger: '2',
    },
  ]);
});
