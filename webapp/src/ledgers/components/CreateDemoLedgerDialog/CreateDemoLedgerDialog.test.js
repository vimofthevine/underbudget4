import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import renderWithRouter from '../../../tests/renderWithRouter';
import CreateDemoLedgerDialog from './CreateDemoLedgerDialog';

const render = (show = true) => {
  const queryClient = new QueryClient();
  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <CreateDemoLedgerDialog />
      </QueryClientProvider>,
    ),
    queryClient,
  };
};

test('error message is shown when request results in an error', async () => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onPost('/api/demos').reply(400);

  render();

  userEvent.type(screen.getByLabelText(/name/i), 'my demo name');
  userEvent.click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() => expect(screen.getByText(/unable to create demo/i)).toBeInTheDocument());
});

test('dialog is closed and query is refreshed when request is successful', async () => {
  const mockAxios = new MockAdapter(axios, { delayResponse: 100 });
  mockAxios.onPost('/api/demos').reply(201);

  const { queryClient } = render();
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  expect(screen.getByRole('heading', { name: /create demo/i })).toBeInTheDocument();

  const createButton = screen.getByRole('button', { name: /create/i });

  // Should prevent submission when required fields are missing
  userEvent.click(createButton);
  await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());
  expect(createButton).toBeDisabled();

  userEvent.type(screen.getByLabelText(/name/i), 'my demo name');
  await waitFor(() => expect(screen.queryByText(/required/i)).not.toBeInTheDocument());

  userEvent.type(screen.getByLabelText(/currency/i), '{selectall}UAH');
  userEvent.type(screen.getByLabelText(/number of months/i), '{selectall}1a0');
  userEvent.type(screen.getByLabelText(/randomization seed/i), '{selectall}77b77');
  await waitFor(() => expect(createButton).toBeEnabled());
  userEvent.click(createButton);

  // Should show progress indicator while request is submitting
  await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  // Should include all form fields in the request
  await waitFor(() => expect(mockAxios.history.post).toHaveLength(1));
  expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
    name: 'my demo name',
    currency: 980,
    months: 10,
    seed: 7777,
  });
  // Should refresh ledger query after submission
  await waitFor(() => expect(invalidateQueries).toHaveBeenCalledWith('ledgers'));
  // Should close the dialog after submission
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /create demo/i })).not.toBeInTheDocument(),
  );
});
