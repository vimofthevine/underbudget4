import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import ActiveBudgetsList from '../ActiveBudgetsList';

const render = (activeBudgets, code = 200) => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi();
  mockApi.onGet('/api/ledgers/2/active-budgets').reply(code, { activeBudgets });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        retryDelay: 200,
      },
    },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/budgets/*' element={<ActiveBudgetsList />} />
        </Routes>
      </QueryClientProvider>,
      { route: '/budgets' },
    ),
    mockApi,
    queryClient,
  };
};

test('should show error message when unable to fetch budgets', async () => {
  render({}, 404);
  await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
});

test('should show all active budgets', async () => {
  const budgets = [
    { id: 1, budgetId: 7, name: 'This Year', year: 2021 },
    { id: 2, budgetId: 6, name: 'Last Year', year: 2020 },
    { id: 3, budgetId: 5, name: 'Old Budget', year: 2019 },
    { id: 4, budgetId: 5, name: 'Old Budget', year: 2018 },
  ];
  render(budgets);
  await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  budgets.forEach((budget) => {
    expect(
      screen.getByRole('button', { name: `${budget.year} ${budget.name}` }),
    ).toBeInTheDocument();
  });
});

test('should navigate to budget route when card is clicked', async () => {
  const { history } = render([{ id: 1, budgetId: 2, name: 'Budget', year: 2021 }]);
  await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  userEvent.click(screen.getByRole('button', { name: '2021 Budget' }));
  expect(history.location.pathname).toBe('/budget/2');
});

test('should navigate to modify-active route when change button clicked', async () => {
  const { history } = render([{ id: 1, budgetId: 2, name: 'Budget', year: 2021 }]);
  await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  userEvent.click(screen.getByRole('button', { name: /change/i }));
  expect(history.location.pathname).toBe('/budgets/modify-active/1');
});

test('should prompt to confirm deletion of active budget', async () => {
  const { mockApi, queryClient } = render([{ id: 1, budgetId: 2, name: 'Budget', year: 2021 }]);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
  mockApi.onDelete('/api/active-budgets/1').reply(204);

  await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  // Reject cancellation
  userEvent.click(screen.getByRole('button', { name: /delete/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /cancel/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  expect(mockApi.history.delete).toHaveLength(0);

  // Confirm cancellation
  userEvent.click(screen.getByRole('button', { name: /delete/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /ok/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(mockApi.history.delete).toHaveLength(1));
  expect(mockApi.history.delete[0].url).toBe('/api/active-budgets/1');
  await waitFor(() =>
    expect(invalidateQueries).toHaveBeenCalledWith(['active-budgets', { ledger: '2' }]),
  );
});
