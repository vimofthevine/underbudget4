import { configure, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import AccountReconciliationsPage from '../AccountReconciliationsPage';

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
          <Route path='/account/:id/reconciliations' element={<AccountReconciliationsPage />} />
        </Routes>
      </QueryClientProvider>,
      { route: '/account/9/reconciliations' },
    ),
    mockApi,
    queryClient,
  };
};

test('should use account ID from route', async () => {
  render((api) => {
    api.onGet('/api/accounts/9').reply(200, {
      name: 'The Account Name',
    });
  });

  await waitFor(() =>
    expect(
      screen.getByRole('heading', { name: 'The Account Name Reconciliations' }),
    ).toBeInTheDocument(),
  );
});
