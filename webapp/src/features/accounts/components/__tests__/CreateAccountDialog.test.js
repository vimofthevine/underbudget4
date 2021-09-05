import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import renderWithRouter from 'tests/renderWithRouter';
import CreateAccountDialog from '../CreateAccountDialog';

const render = () => {
  localStorage.setItem('underbudget.selected.ledger', 'ledger-id');

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  const mock = new MockAdapter(axios);
  mock.onGet('/api/ledgers/ledger-id/account-categories').reply(200, {
    categories: [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ],
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <CreateAccountDialog />
      </QueryClientProvider>,
    ),
    mock,
    queryClient,
  };
};

describe('CreateAccountDialog', () => {
  it('should prevent submission when required fields are missing', async () => {
    const { mock } = render();

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    await waitFor(() => expect(mock.history.get.length).toBe(1));

    userEvent.tab();

    await waitFor(() => expect(screen.getAllByText(/required/i)).toHaveLength(1));
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled();
  });

  it('should show error message when request error', async () => {
    const { mock } = render();
    mock.onPost('/api/account-categories/2/accounts').reply(400);

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    await waitFor(() => expect(mock.history.get.length).toBe(1));

    userEvent.type(screen.getByLabelText(/^name/i), 'my account name');
    userEvent.click(screen.getByRole('button', { name: /open/i }));
    userEvent.click(screen.getByRole('option', { name: 'Category 2' }));

    await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeEnabled());
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => expect(screen.getByText(/unable to create account/i)).toBeInTheDocument());
  });

  it('should close and refresh query when successful create', async () => {
    const { mock, queryClient } = render();
    mock.onPost('/api/account-categories/2/accounts').reply(201);
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    await waitFor(() => expect(mock.history.get.length).toBe(1));

    userEvent.type(screen.getByLabelText(/^name/i), 'my account name');
    userEvent.click(screen.getByRole('button', { name: /open/i }));
    userEvent.click(screen.getByRole('option', { name: 'Category 2' }));

    await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeEnabled());
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /create account/i })).not.toBeInTheDocument(),
    );
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      name: 'my account name',
      institution: '',
      accountNumber: '',
    });
    expect(invalidateQueries).toHaveBeenCalledWith([
      'account-categories',
      {
        ledger: 'ledger-id',
      },
    ]);
  });

  it('should send all populated fields', async () => {
    const { mock } = render();
    mock.onPost('/api/account-categories/2/accounts').reply(201);

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    await waitFor(() => expect(mock.history.get.length).toBe(1));

    userEvent.type(screen.getByLabelText(/^name/i), 'my account name');
    userEvent.type(screen.getByLabelText(/institution name/i), 'my bank name');
    userEvent.type(screen.getByLabelText(/account number/i), '8675309');
    userEvent.click(screen.getByRole('button', { name: /open/i }));
    userEvent.click(screen.getByRole('option', { name: 'Category 2' }));

    await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeEnabled());
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /create account/i })).not.toBeInTheDocument(),
    );
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      name: 'my account name',
      institution: 'my bank name',
      accountNumber: '8675309',
    });
  });
});
