import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import BudgetPage from './BudgetPage';

const render = (route = '/budget/7') => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet('/api/budgets/7').reply(200, {
    name: 'Test Budget',
    periods: 12,
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
          <Route path='/budget/:id/*' element={<BudgetPage />} />
        </Routes>
      </QueryClientProvider>,
      { route },
    ),
    mockApi,
    queryClient,
  };
};

test('should display modify-budget dialog if initial route matches', async () => {
  const { history } = render('/budget/7/modify');
  expect(screen.getByRole('heading', { name: /modify budget/i })).toBeInTheDocument();

  await waitFor(() => expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument());
  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/budget/7'));
  expect(screen.queryByRole('heading', { name: /set budget/i })).not.toBeInTheDocument();
});

test('should open dialogs when using nav bar actions', async () => {
  const { history } = render();

  await waitFor(() =>
    expect(screen.getByRole('heading', { name: 'Test Budget' })).toBeInTheDocument(),
  );

  // Make sure no dialogs open initially
  expect(screen.queryAllByRole('heading')).toHaveLength(1);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /modify/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify budget/i })).toBeInTheDocument(),
  );
  expect(history.location.pathname).toBe('/budget/7/modify');
});
