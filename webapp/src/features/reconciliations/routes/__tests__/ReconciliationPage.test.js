import { configure, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import ReconciliationPage from '../ReconciliationPage';

const render = (configureApi = () => 0) => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  configureApi(mockApi);

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
          <Route path='/reconciliation/:id' element={<ReconciliationPage />} />
        </Routes>
      </QueryClientProvider>,
      { route: '/reconciliation/13' },
    ),
    mockApi,
    queryClient,
  };
};

test('should use reconciliation ID from route', async () => {
  render((api) => {
    api.onGet('/api/accounts/9').reply(200, { name: 'The Account Name' });
    api.onGet('/api/reconciliations/13').reply(200, {
      accountId: 9,
      beginningDate: '2021-12-04',
      endingDate: '2022-01-03',
    });
  });

  await waitFor(() =>
    expect(
      screen.getByRole('heading', { name: 'The Account Name 2021-12-04 - 2022-01-03' }),
    ).toBeInTheDocument(),
  );
});
