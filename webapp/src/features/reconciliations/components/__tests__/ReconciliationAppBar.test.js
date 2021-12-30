import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import ReconciliationAppBar from '../ReconciliationAppBar';

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
        <ReconciliationAppBar reconciliationId={13} prominent={false} />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should display account name and reconciliation dates in title', async () => {
  render((api) => {
    api.onGet('/api/accounts/3').reply(200, { name: 'Account 3' });
    api
      .onGet('/api/reconciliations/13')
      .reply(200, { accountId: 3, beginningDate: '2021-11-02', endingDate: '2021-12-01' });
  });

  expect(screen.getByRole('heading', { name: '...' })).toBeInTheDocument();
  await waitFor(() =>
    expect(
      screen.getByRole('heading', { name: 'Account 3 2021-11-02 - 2021-12-01' }),
    ).toBeInTheDocument(),
  );
});
