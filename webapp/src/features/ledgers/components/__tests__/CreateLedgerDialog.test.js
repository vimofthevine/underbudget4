import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import renderWithRouter from 'test/renderWithRouter';
import CreateLedgerDialog from '../CreateLedgerDialog';

const render = () => {
  const queryClient = new QueryClient();
  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <CreateLedgerDialog />
      </QueryClientProvider>,
    ),
    queryClient,
  };
};

describe('CreateLedgerDialog', () => {
  it('should prevent submission when required fields are missing', async () => {
    render();
    expect(screen.getByRole('heading', { name: /create ledger/i })).toBeInTheDocument();

    const createButton = screen.getByRole('button', { name: /create/i });

    userEvent.click(createButton);
    await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());

    expect(createButton).toBeDisabled();
  });

  it('should show error message when error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/ledgers').reply(400);

    render();
    expect(screen.getByRole('heading', { name: /create ledger/i })).toBeInTheDocument();

    userEvent.type(screen.getByLabelText(/name/i), 'my ledger name');
    userEvent.type(screen.getByLabelText(/currency/i), '{selectall}UAH');
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => expect(screen.getByText(/unable to create ledger/i)).toBeInTheDocument());
  });

  it('should close and refresh query when successful create', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/ledgers').reply(201);

    const { queryClient } = render();
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    expect(screen.getByRole('heading', { name: /create ledger/i })).toBeInTheDocument();

    userEvent.type(screen.getByLabelText(/name/i), 'my ledger name');
    userEvent.type(screen.getByLabelText(/currency/i), '{selectall}UAH');
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /create ledger/i })).not.toBeInTheDocument(),
    );
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      name: 'my ledger name',
      currency: 980,
    });
    expect(invalidateQueries).toHaveBeenCalledWith('ledgers');
  });
});
