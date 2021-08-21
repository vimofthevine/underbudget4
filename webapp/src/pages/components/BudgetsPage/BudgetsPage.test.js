import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import BudgetsPage from './BudgetsPage';

const render = (route = '/budgets') => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet('/api/ledgers/2/budgets').reply(200, {
    budgets: [{ id: 7, name: 'Test Budget', periods: 12 }],
  });
  mockApi.onGet('/api/ledgers/2/active-budgets').reply(200, {
    activeBudgets: [{ id: 4, budgetId: 7, name: 'Test Budget', year: 2021 }],
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
          <Route path='/budgets/*' element={<BudgetsPage />} />
        </Routes>
      </QueryClientProvider>,
      { route },
    ),
    mockApi,
    queryClient,
  };
};

test('should display active budgets tab by default', async () => {
  render();
  await waitFor(() =>
    expect(screen.getByRole('button', { name: '2021 Test Budget' })).toBeInTheDocument(),
  );
  expect(
    screen.queryByRole('button', { name: 'Test Budget Monthly (12)' }),
  ).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('tab', { name: /all/i }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Test Budget Monthly (12)' })).toBeInTheDocument(),
  );
  expect(screen.queryByRole('button', { name: '2021 Test Budget' })).not.toBeInTheDocument();
});

test('should display all budgets tab if initial route matches', async () => {
  render('/budgets?tab=all');
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Test Budget Monthly (12)' })).toBeInTheDocument(),
  );
  expect(screen.queryByRole('button', { name: '2021 Test Budget' })).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('tab', { name: /active/i }));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: '2021 Test Budget' })).toBeInTheDocument(),
  );
  expect(
    screen.queryByRole('button', { name: 'Test Budget Monthly (12)' }),
  ).not.toBeInTheDocument();
});

test('should display create-budget dialog if initial route matches', async () => {
  const { history } = render('/budgets/create');
  expect(screen.getByRole('heading', { name: /create budget/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/budgets'));
  expect(screen.queryByRole('heading', { name: /create budget/i })).not.toBeInTheDocument();
});

test('should display set-active dialog if initial route matches', async () => {
  const { history } = render('/budgets/set-active');
  expect(screen.getByRole('heading', { name: /set active budget/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/budgets'));
  expect(screen.queryByRole('heading', { name: /set active budget/i })).not.toBeInTheDocument();
});

test('should display modify-active dialog if initial route matches', async () => {
  const { history } = render('/budgets/modify-active/4');
  expect(screen.getByRole('heading', { name: /modify active budget/i })).toBeInTheDocument();

  await waitFor(() => expect(history.location.pathname).toBe('/budgets'));
  expect(screen.queryByRole('heading', { name: /modify active budget/i })).not.toBeInTheDocument();
});

test('should open create dialogs when using nav bar actions', async () => {
  const { history } = render();

  // Make sure no dialogs open initially
  expect(screen.queryAllByRole('heading')).toHaveLength(1);
  expect(screen.getByRole('heading', { name: /budgets/i })).toBeInTheDocument();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /set active budget/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /set active budget/i })).toBeInTheDocument(),
  );
  expect(history.location.pathname).toBe('/budgets/set-active');

  userEvent.click(screen.getByRole('tab', { name: /all/i }));

  userEvent.click(screen.getByRole('button', { name: /create budget/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /create budget/i })).toBeInTheDocument(),
  );
  expect(history.location.pathname).toBe('/budgets/create');
});
