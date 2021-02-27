import { fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import renderWithRouter from '../../../tests/renderWithRouter';
import { LedgersContextProvider, useLedgersDispatch } from '../LedgersContext';
import CreateLedgerDialog from './CreateLedgerDialog';

const CreateLedgerButton = () => {
  const dispatch = useLedgersDispatch();
  return (
    <button onClick={() => dispatch({ type: 'showCreateLedger' })} type='button'>
      create ledger
    </button>
  );
};

const render = () => {
  const queryClient = new QueryClient();
  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <LedgersContextProvider>
          <>
            <CreateLedgerButton />
            <CreateLedgerDialog />
          </>
        </LedgersContextProvider>
        ,
      </QueryClientProvider>,
    ),
    queryClient,
  };
};

describe('CreateLedgerDialog', () => {
  it('should prevent submission when required fields are missing', async () => {
    render();

    fireEvent.click(screen.getByRole('button', { name: /create ledger/i }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create ledger/i })).toBeInTheDocument(),
    );

    const createButton = screen.getByRole('button', { name: /create/i });

    fireEvent.click(createButton);
    await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());

    expect(createButton).toBeDisabled();
  });

  it('should show error message when error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/ledgers').reply(400);

    render();

    fireEvent.click(screen.getByRole('button', { name: /create ledger/i }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create ledger/i })).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'my ledger name' },
    });
    fireEvent.change(screen.getByLabelText(/currency/i), {
      target: { value: 'UAH' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => expect(screen.getByText(/unable to create ledger/i)).toBeInTheDocument());
  });

  it('should close and refresh query when successful create', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/ledgers').reply(201);

    const { queryClient } = render();
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    fireEvent.click(screen.getByRole('button', { name: /create ledger/i }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create ledger/i })).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'my ledger name' },
    });
    fireEvent.change(screen.getByLabelText(/currency/i), {
      target: { value: 'UAH' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

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
