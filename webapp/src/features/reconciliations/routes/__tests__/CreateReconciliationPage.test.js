import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import CreateReconciliationPage from '../CreateReconciliationPage';

const render = (route = '/account/9/create-reconciliation') => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });

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
          <Route path='/account/:id/create-reconciliation' element={<CreateReconciliationPage />} />
        </Routes>
      </QueryClientProvider>,
      { route },
    ),
    mockApi,
    queryClient,
  };
};

test('should prompt to navigate away from page', async () => {
  window.confirm = jest.fn(() => true);
  const { history } = render();

  userEvent.click(screen.getByRole('button', { name: /cancel this operation/i }));
  await waitFor(() => expect(window.confirm).toHaveBeenCalled());
  await waitFor(() => expect(history.location.pathname).toBe('/account/9'));
});

test('should navigate to previous page', async () => {
  window.confirm = jest.fn(() => true);
  const { history } = render({
    pathname: '/account/9/create-reconciliation',
    state: { from: '/prev-page' },
  });

  userEvent.click(screen.getByRole('button', { name: /cancel this operation/i }));
  await waitFor(() => expect(window.confirm).toHaveBeenCalled());
  await waitFor(() => expect(history.location.pathname).toBe('/prev-page'));
});

test('should open create-transaction dialog', async () => {
  render();

  userEvent.click(screen.getByRole('button', { name: /create transaction/i }));
  await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
  expect(screen.getByRole('heading', { name: /create transaction/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.queryByRole('heading', { name: /create transaction/i })).not.toBeInTheDocument();
});
