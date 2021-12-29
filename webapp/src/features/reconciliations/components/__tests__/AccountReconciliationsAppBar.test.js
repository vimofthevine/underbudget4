import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import AccountReconciliationsAppBar from '../AccountReconciliationsAppBar';

const render = (configureApi = () => 0) => {
  const mockApi = setupMockApi({ delayResponse: 0 });
  configureApi(mockApi);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <AccountReconciliationsAppBar accountId={3} prominent={false} />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should display account name in title', async () => {
  render((api) => {
    api.onGet('/api/accounts/3').reply(200, { name: 'Account 3' });
  });

  expect(screen.getByRole('heading', { name: '...' })).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: 'Account 3 Reconciliations' })).toBeInTheDocument(),
  );
});

test('should navigate back to account route', async () => {
  const { history } = render();

  userEvent.click(screen.getByRole('button', { name: /go to previous page/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/account/3'));
});

test('should navigate to create-reconciliation route', async () => {
  const { history } = render();

  userEvent.click(screen.getByRole('button', { name: /reconcile account/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/account/3/create-reconciliation'));
});
