import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import BudgetIncomesPage from '../BudgetIncomesPage';

const render = (route = '/budget/5/incomes') => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet('/api/budgets/5').reply(200, { name: 'My Budget' });
  mockApi.onGet('/api/budgets/5/periodic-incomes').reply(200, {
    incomes: [{ id: 3, name: 'My Income', amount: 123456 }],
  });
  mockApi.onGet('/api/budget-periodic-incomes/3').reply(200, {
    name: 'My Income',
    amount: 123456,
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
          <Route path='/budget/:id/incomes/*' element={<BudgetIncomesPage />} />
        </Routes>
      </QueryClientProvider>,
      { route },
    ),
    mockApi,
    queryClient,
  };
};

test('should display create-periodic dialog if initial route matches', async () => {
  const { history } = render('/budget/5/incomes/create-periodic');
  expect(screen.getByRole('heading', { name: /create periodic income/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/budget/5/incomes'));
  expect(
    screen.queryByRole('heading', { name: /create periodic income/i }),
  ).not.toBeInTheDocument();
});

test('should display modify-periodic dialog if initial route matches', async () => {
  const { history } = render('/budget/5/incomes/modify-periodic/7');
  expect(screen.getByRole('heading', { name: /modify periodic income/i })).toBeInTheDocument();

  await waitFor(() => expect(history.location.pathname).toBe('/budget/5/incomes'));
  expect(
    screen.queryByRole('heading', { name: /modify periodic income/i }),
  ).not.toBeInTheDocument();
});

test('should open create dialog when using nav bar action', async () => {
  const { history } = render();
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: 'My Budget Incomes' })).toBeInTheDocument(),
  );

  // Make sure no dialogs open initially
  expect(screen.queryAllByRole('heading')).toHaveLength(1);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /create periodic income/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /create periodic income/i })).toBeInTheDocument(),
  );
  expect(history.location.pathname).toBe('/budget/5/incomes/create-periodic');
});

test('should open modify dialog using list action', async () => {
  const { history } = render();
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: 'My Budget Incomes' })).toBeInTheDocument(),
  );

  // Make sure no dialogs open initially
  expect(screen.queryAllByRole('heading')).toHaveLength(1);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /My Income/ }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify periodic income/i })).toBeInTheDocument(),
  );
  expect(history.location.pathname).toBe('/budget/5/incomes/modify-periodic/3');
});
