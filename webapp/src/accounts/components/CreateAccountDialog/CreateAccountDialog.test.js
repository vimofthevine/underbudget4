import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import renderWithRouter from '../../../tests/renderWithRouter';
import { AccountContextProvider } from '../../contexts/account';
import useCreateAccount from '../../hooks/useCreateAccount';
import CreateAccountDialog from './CreateAccountDialog';

const OpenDialogButton = () => (
  <button onClick={useCreateAccount()} type='button'>
    Open
  </button>
);

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
  mock
    .onGet('/api/ledgers/ledger-id/accountCategories?projection=categoryWithAccounts')
    .reply(200, {
      _embedded: {
        accountCategories: [
          { id: 'cat-id-1', name: 'Category 1' },
          { id: 'cat-id-2', name: 'Category 2' },
        ],
      },
    });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <AccountContextProvider>
          <>
            <OpenDialogButton />
            <CreateAccountDialog />
          </>
        </AccountContextProvider>
      </QueryClientProvider>,
    ),
    mock,
    queryClient,
  };
};

describe('CreateAccountDialog', () => {
  it('should prevent submission when required fields are missing', async () => {
    const { mock } = render();

    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument(),
    );
    await waitFor(() => expect(mock.history.get.length).toBe(1));

    const createButton = screen.getByRole('button', { name: /create/i });
    userEvent.click(createButton);
    await waitFor(() => expect(screen.getAllByText(/required/i)).toHaveLength(2));

    expect(createButton).toBeDisabled();
  });

  it('should show error message when request error', async () => {
    const { mock } = render();
    mock.onPost('/api/accounts').reply(400);

    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument(),
    );
    await waitFor(() => expect(mock.history.get.length).toBe(1));

    await userEvent.type(screen.getByLabelText(/^name/i), 'my account name');
    userEvent.click(screen.getByRole('button', { name: /open/i }));
    userEvent.click(screen.getByRole('option', { name: 'Category 2' }));
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => expect(screen.getByText(/unable to create account/i)).toBeInTheDocument());
  });

  it('should close and refresh query when successful create', async () => {
    const { mock, queryClient } = render();
    mock.onPost('/api/accounts').reply(201);
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument(),
    );
    await waitFor(() => expect(mock.history.get.length).toBe(1));

    await userEvent.type(screen.getByLabelText(/^name/i), 'my account name');
    userEvent.click(screen.getByRole('button', { name: /open/i }));
    userEvent.click(screen.getByRole('option', { name: 'Category 2' }));
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /create account/i })).not.toBeInTheDocument(),
    );
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      category: '/api/account-categories/cat-id-2',
      name: 'my account name',
      institution: '',
      accountNumber: '',
    });
    expect(invalidateQueries).toHaveBeenCalledWith([
      'accountCategories',
      {
        ledger: 'ledger-id',
      },
    ]);
  });

  it('should send all populated fields', async () => {
    const { mock } = render();
    mock.onPost('/api/accounts').reply(201);

    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument(),
    );
    await waitFor(() => expect(mock.history.get.length).toBe(1));

    await userEvent.type(screen.getByLabelText(/^name/i), 'my account name');
    await userEvent.type(screen.getByLabelText(/institution name/i), 'my bank name');
    await userEvent.type(screen.getByLabelText(/account number/i), '8675309');
    userEvent.click(screen.getByRole('button', { name: /open/i }));
    userEvent.click(screen.getByRole('option', { name: 'Category 2' }));

    await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).not.toBeDisabled());
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /create account/i })).not.toBeInTheDocument(),
    );
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      category: '/api/account-categories/cat-id-2',
      name: 'my account name',
      institution: 'my bank name',
      accountNumber: '8675309',
    });
  });
});
