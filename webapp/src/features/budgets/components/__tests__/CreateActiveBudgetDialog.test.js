import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import CreateActiveBudgetDialog from '../CreateActiveBudgetDialog';

const render = () => {
  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet('/api/ledgers/2/budgets').reply(200, {
    budgets: [
      { id: 1, name: 'Budget 1' },
      { id: 2, name: 'Budget 2' },
    ],
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity } },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <CreateActiveBudgetDialog />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should prevent submission when required fields are missing', async () => {
  render();
  expect(screen.getByRole('heading', { name: /set active budget/i })).toBeInTheDocument();

  const create = screen.getByRole('button', { name: /set/i });
  userEvent.click(create);

  await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());
  expect(create).toBeDisabled();
});

test('should show error message when request error', async () => {
  const { mockApi } = render();
  mockApi.onPost('/api/ledgers/2/active-budgets').reply(400);

  expect(screen.getByRole('heading', { name: /set active budget/i })).toBeInTheDocument();
  await waitFor(() => expect(mockApi.history.get.length).toBe(1));

  userEvent.type(screen.getByRole('textbox', { name: /budget/i }), 'Budget 1');
  await waitFor(() => expect(screen.getByRole('button', { name: /set/i })).toBeEnabled());

  userEvent.click(screen.getByRole('button', { name: /set/i }));
  await waitFor(() => expect(screen.getByText(/unable to set active budget/i)).toBeInTheDocument());
});

test('should close and refresh query when successful create', async () => {
  const { mockApi, queryClient } = render();
  mockApi.onPost('/api/ledgers/2/active-budgets').reply(201);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  expect(screen.getByRole('heading', { name: /set active budget/i })).toBeInTheDocument();
  await waitFor(() => expect(mockApi.history.get.length).toBe(1));

  userEvent.type(screen.getByRole('textbox', { name: /budget/i }), 'Budget 1');
  await waitFor(() => expect(screen.getByRole('button', { name: /set/i })).toBeEnabled());

  userEvent.click(screen.getByRole('button', { name: /set/i }));
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /set active budget/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.post[0].data)).toEqual({
    year: 2021,
    budgetId: 1,
  });
  expect(invalidateQueries).toHaveBeenCalledWith(['active-budgets', { ledger: '2' }]);
});
