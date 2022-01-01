import { configure, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { transactionsGenerator } from 'test/data-generators';
import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import ReconciledTransactions from '../ReconciledTransactions';

const render = (configureApi = () => 0) => {
  configure({ defaultHidden: true });

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
        <ReconciledTransactions reconciliationId={13} />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should display error when failed to retrieve transactions', async () => {
  render();

  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

  expect(screen.queryAllByRole('row')).toHaveLength(1);
});

test('should display transactions', async () => {
  render((api) => {
    api.onGet('/api/reconciliations/13/transactions?page=1&size=25').reply(200, {
      transactions: transactionsGenerator(3, {
        accountId: 7,
        cleared: true,
        reconciliationId: 13,
      }),
      total: 3,
    });
  });

  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(4));

  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /next page/i })).not.toBeInTheDocument();
});

test('should display pagination when reconciliation contains enough transactions', async () => {
  render((api) => {
    api.onGet('/api/reconciliations/13/transactions?page=1&size=25').reply(200, {
      transactions: transactionsGenerator(25, {
        accountId: 7,
        cleared: true,
        reconciliationId: 13,
      }),
      total: 30,
    });
  });

  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(26));

  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
});
