import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import { reconciliationGenerator } from 'test/data-generators';
import setupMockApi from 'test/setupMockApi';
import AccountReconciliationsList from '../AccountReconciliationsList';

const render = (configureApi = () => 0) => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

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
        <AccountReconciliationsList accountId={9} />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should display alert when no reconciliations exist', async () => {
  const { history, mockApi } = render((api) => {
    api.onGet('/api/accounts/9/reconciliations?page=1&size=25').reply(200, {
      reconciliations: [],
      total: 0,
    });
  });

  await waitFor(() => expect(mockApi.history.get).toHaveLength(2));

  expect(screen.getByRole('alert')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /create/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/account/9/create-reconciliation'));
});

test('should display reconciliations for account', async () => {
  const { history, mockApi } = render((api) => {
    api.onGet('/api/accounts/9/reconciliations?page=1&size=25').reply(200, {
      reconciliations: [
        reconciliationGenerator({
          accountId: 9,
          beginningDate: '2021-10-05',
          endingDate: '2021-11-04',
          endingBalance: 123456,
        }),
        reconciliationGenerator({
          accountId: 9,
          beginningDate: '2021-11-05',
          endingDate: '2021-12-04',
          endingBalance: 132546,
        }),
        reconciliationGenerator({
          id: 17,
          accountId: 9,
          beginningDate: '2021-12-05',
          endingDate: '2022-01-04',
          endingBalance: 143265,
        }),
      ],
      total: 3,
    });
  });

  await waitFor(() => expect(mockApi.history.get).toHaveLength(2));

  expect(
    screen.getByRole('button', { name: '2021-10-05 - 2021-11-04 $1,234.56' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: '2021-11-05 - 2021-12-04 $1,325.46' }),
  ).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: '2021-12-05 - 2022-01-04 $1,432.65' }));

  await waitFor(() => expect(history.location.pathname).toBe('/reconciliation/17'));
});
