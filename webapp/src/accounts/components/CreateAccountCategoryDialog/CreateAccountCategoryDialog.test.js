import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import renderWithRouter from '../../../tests/renderWithRouter';
import CreateAccountCategoryDialog from './CreateAccountCategoryDialog';

const render = () => {
  localStorage.setItem('underbudget.selected.ledger', 'ledger-id');

  const queryClient = new QueryClient();
  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <CreateAccountCategoryDialog />
      </QueryClientProvider>,
    ),
    queryClient,
  };
};

describe('CreateAccountCategoryDialog', () => {
  it('should prevent submission when required fields are missing', async () => {
    render();
    expect(screen.getByRole('heading', { name: /create category/i })).toBeInTheDocument();

    const createButton = screen.getByRole('button', { name: /create/i });

    userEvent.click(createButton);
    await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());

    expect(createButton).toBeDisabled();
  });

  it('should show error message when request error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/ledgers/ledger-id/account-categories').reply(400);

    render();
    expect(screen.getByRole('heading', { name: /create category/i })).toBeInTheDocument();

    userEvent.type(screen.getByLabelText(/name/i), 'my category name');
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(screen.getByText(/unable to create account category/i)).toBeInTheDocument(),
    );
  });

  it('should close and refresh query when successful create', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/ledgers/ledger-id/account-categories').reply(201);

    const { queryClient } = render();
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    expect(screen.getByRole('heading', { name: /create category/i })).toBeInTheDocument(),

    userEvent.type(screen.getByLabelText(/name/i), 'my category name');
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /create category/i })).not.toBeInTheDocument(),
    );
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      name: 'my category name',
    });
    expect(invalidateQueries).toHaveBeenCalledWith([
      'account-categories',
      {
        ledger: 'ledger-id',
      },
    ]);
  });
});
