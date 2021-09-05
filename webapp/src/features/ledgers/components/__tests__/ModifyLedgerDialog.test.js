import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import renderWithRouter from 'tests/renderWithRouter';
import ModifyLedgerDialog from '../ModifyLedgerDialog';

const render = (ledger) => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet(`/api/ledgers/${ledger.id}`).reply(200, ledger);

  const queryClient = new QueryClient();

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path='/ledgers/*'
            element={
              <Routes>
                <Route path='modify/:id' element={<ModifyLedgerDialog />} />
              </Routes>
            }
          />
        </Routes>
      </QueryClientProvider>,
      { route: `/ledgers/modify/${ledger.id}` },
    ),
    mockAxios,
    queryClient,
  };
};

test('should prevent submission when required fields are missing', async () => {
  render({ id: 'ledger-id', name: 'A ledger', currency: 980, lastUpdated: '' });

  await waitFor(() => expect(screen.getByLabelText(/name/i)).toHaveValue('A ledger'));
  expect(screen.getByLabelText(/currency/i)).toHaveValue('UAH');

  userEvent.type(screen.getByLabelText(/name/i), '{selectall}{backspace}');

  const saveButton = screen.getByRole('button', { name: /save/i });
  userEvent.click(saveButton);
  await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());
  expect(saveButton).toBeDisabled();
});

test('should show error message when error', async () => {
  const { mockAxios } = render({
    id: 'ledger-id',
    name: 'A ledger',
    currency: 978,
    lastUpdated: '',
  });
  mockAxios.onPut('/api/ledgers/ledger-id').reply(400);

  await waitFor(() => expect(screen.getByLabelText(/name/i)).toHaveValue('A ledger'));

  userEvent.click(screen.getByRole('button', { name: /save/i }));
  await waitFor(() => expect(screen.getByText(/unable to modify ledger/i)).toBeInTheDocument());
});

test('should close and refresh query when successful modify', async () => {
  const { mockAxios, queryClient } = render({
    id: 'ledger-id',
    name: 'A ledger',
    currency: 978,
    lastUpdated: '',
  });
  mockAxios.onPut('/api/ledgers/ledger-id').reply(200);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  await waitFor(() => expect(screen.getByLabelText(/name/i)).toHaveValue('A ledger'));

  userEvent.type(screen.getByLabelText(/name/i), '{selectall}my ledger');
  userEvent.type(screen.getByLabelText(/currency/i), '{selectall}USD');
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify ledger/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
    name: 'my ledger',
    currency: 840,
  });
  expect(invalidateQueries).toHaveBeenCalledWith('ledgers');
  expect(invalidateQueries).toHaveBeenCalledWith(['ledger', 'ledger-id']);
});
