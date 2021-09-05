import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import TransactionDetailsDialog from '../TransactionDetailsDialog';

const render = () => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2').reply(200, { currency: 840 });
  mockAxios.onGet('/api/transactions/7').reply(200, {
    payee: 'Vendor Name',
    recordedDate: '2021-05-12',
    accountTransactions: [{ id: 1, accountId: 2, memo: '', cleared: false, amount: 1450 }],
    envelopeTransactions: [{ id: 2, envelopeId: 3, memo: '', amount: 1450 }],
  });
  mockAxios.onGet('/api/ledgers/2/account-categories').reply(200, {});
  mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(200, {});

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/transaction/:transactionId' element={<TransactionDetailsDialog />} />
        </Routes>
      </QueryClientProvider>,
      { route: `/transaction/7` },
    ),
    mockAxios,
    queryClient,
  };
};

test('should display details for transaction based on route', async () => {
  render();
  expect(screen.getByRole('heading', { name: /details/i })).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('Vendor Name')).toBeInTheDocument());
});

test('should navigate to parent route when closed', async () => {
  const { history } = render();
  expect(screen.getByRole('heading', { name: /details/i })).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: /close/i }));
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /details/i })).not.toBeInTheDocument(),
  );
  expect(history.location.pathname).toBe('/transaction');
});

test('should navigate to modify route when modify button is clicked', async () => {
  const { history } = render();
  expect(screen.getByRole('heading', { name: /details/i })).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: /modify/i }));
  expect(history.location.pathname).toBe('/transaction/7/modify');
});
