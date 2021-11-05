import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import BudgetExpensesPage from '../BudgetExpensesPage';

const render = (route = '/budget/5/expenses') => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet('/api/budgets/5').reply(200, {
    id: 5,
    name: 'Test Budget',
    periods: 12,
  });
  mockApi.onGet('/api/budgets/5/annual-expenses').reply(200, {
    expenses: [{ id: 3, name: 'My Yearly', amount: 1234, details: [] }],
  });
  mockApi.onGet('/api/budgets/5/periodic-expenses').reply(200, {
    expenses: [{ id: 7, name: 'My Periodic', amount: 4321 }],
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/budget/:id/expenses/*' element={<BudgetExpensesPage />} />
        </Routes>
      </QueryClientProvider>,
      { route },
    ),
    mockApi,
    queryClient,
  };
};

test('should display periodic expenses tab by default', async () => {
  render();
  await waitFor(() =>
    expect(screen.getByRole('button', { name: /My Periodic/ })).toBeInTheDocument(),
  );
  expect(screen.queryByRole('button', { name: /My Yearly/ })).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('tab', { name: /annual/i }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: /My Yearly/ })).toBeInTheDocument(),
  );
  expect(screen.queryByRole('button', { name: /My Periodic/ })).not.toBeInTheDocument();
});

test('should display annual expenses tab if initial route matches', async () => {
  render('/budget/5/expenses?tab=annual');
  await waitFor(() =>
    expect(screen.getByRole('button', { name: /My Yearly/ })).toBeInTheDocument(),
  );
  expect(screen.queryByRole('button', { name: /My Periodic/ })).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('tab', { name: /periodic/i }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: /My Periodic/ })).toBeInTheDocument(),
  );
  expect(screen.queryByRole('button', { name: /My Yearly/ })).not.toBeInTheDocument();
});

test('should display create-periodic dialog if initial route matches', async () => {
  const { history } = render('/budget/5/expenses/create-periodic');
  expect(screen.getByRole('heading', { name: /create periodic expense/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/budget/5/expenses'));
  expect(
    screen.queryByRole('heading', { name: /create periodic expense/i }),
  ).not.toBeInTheDocument();
});

test('should display create-annual dialog if initial route matches', async () => {
  const { history } = render('/budget/5/expenses/create-annual');
  expect(screen.getByRole('heading', { name: /create annual expense/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/budget/5/expenses'));
  expect(screen.queryByRole('heading', { name: /create annual expense/i })).not.toBeInTheDocument();
});

test('should display modify-periodic dialog if initial route matches', async () => {
  const { history } = render('/budget/5/expenses/modify-periodic/7');
  expect(screen.getByRole('heading', { name: /modify periodic expense/i })).toBeInTheDocument();

  await waitFor(() => expect(history.location.pathname).toBe('/budget/5/expenses'));
  expect(
    screen.queryByRole('heading', { name: /modify periodic expense/i }),
  ).not.toBeInTheDocument();
});

test('should display modify-annual dialog if initial route matches', async () => {
  const { history } = render('/budget/5/expenses/modify-annual/7');
  expect(screen.getByRole('heading', { name: /modify annual expense/i })).toBeInTheDocument();

  await waitFor(() => expect(history.location.pathname).toBe('/budget/5/expenses'));
  expect(screen.queryByRole('heading', { name: /modify annual expense/i })).not.toBeInTheDocument();
});

test('should open create dialogs when using nav bar actions', async () => {
  const { history } = render();

  // Make sure no dialogs open initially
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /create periodic expense/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /create periodic expense/i })).toBeInTheDocument(),
  );
  expect(history.location.pathname).toBe('/budget/5/expenses/create-periodic');

  userEvent.click(screen.getByRole('tab', { name: /annual/i }));

  userEvent.click(screen.getByRole('button', { name: /create annual expense/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /create annual expense/i })).toBeInTheDocument(),
  );
  expect(history.location.pathname).toBe('/budget/5/expenses/create-annual');
});
