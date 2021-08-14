import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import AllBudgetsList from './AllBudgetsList';

const render = (budgets, code = 200) => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi();
  mockApi.onGet('/api/ledgers/2/budgets').reply(code, { budgets });

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
          <Route path='/budgets/*' element={<AllBudgetsList />} />
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

test('should show all created budgets', async () => {
  const budgets = [
    { id: 7, name: 'This Year', periods: 12, buttonText: 'This Year Monthly (12)' },
    { id: 6, name: 'Last Year', periods: 12, buttonText: 'Last Year Monthly (12)' },
    { id: 5, name: 'Old Budget', periods: 52, buttonText: 'Old Budget Weekly (52)' },
  ];
  render(budgets);
  await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  budgets.forEach((budget) => {
    expect(screen.getByRole('button', { name: budget.buttonText })).toBeInTheDocument();
  });
});

test('should navigate to budget route when card is clicked', async () => {
  const { history } = render([{ id: 2, name: 'Budget', periods: 12 }]);
  await waitFor(() => expect(screen.getByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  userEvent.click(screen.getByRole('button', { name: 'Budget Monthly (12)' }));
  expect(history.location.pathname).toBe('/budget/2');
});
