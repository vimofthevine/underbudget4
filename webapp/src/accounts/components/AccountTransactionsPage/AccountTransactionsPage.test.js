import { configure, screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from '../../../ledgers/utils/setSelectedLedger';
import createMediaQuery from '../../../tests/createMediaQuery';
import renderWithRouter from '../../../tests/renderWithRouter';
import AccountTransactionsPage from './AccountTransactionsPage';

const render = ({ route = '/account/7', width = '800px' } = {}) => {
  window.HTMLElement.prototype.scrollTo = () => 0;
  window.matchMedia = createMediaQuery(width);
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2').reply(200, { currency: 840 });
  mockAxios.onGet('/api/accounts/7').reply(200, { name: 'My Account Name' });
  mockAxios.onGet('/api/accounts/7/balance').reply(200, { balance: 8675309 });
  mockAxios.onGet(/\/api\/accounts\/7\/transactions.*/).reply(200, {
    total: 1,
    transactions: [
      {
        id: 15,
        transactionId: 42,
        recordedDate: '2021-05-04', // May the 4th be with you
        payee: 'Darth Vader',
        memo: '',
        cleared: false,
        type: 'expense',
        amount: -8000,
        balance: 8675309,
      },
    ],
  });

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/account/:id/*' element={<AccountTransactionsPage />} />
        </Routes>
      </QueryClientProvider>,
      { route },
    ),
    mockAxios,
    queryClient,
  };
};

// TODO implement these tests
// test('should display create-transaction dialog if initial route matches', async () => {});

// test('should prompt to delete account', async () => {});

// test('should archive account', async () => {});

// test('should unarchive account', async () => {});

// test('should open dialogs when using nav bar actions', async () => {});

test('should display account name and balance in app bar', async () => {
  render();
  const heading = screen.getByRole('heading');
  expect(heading).toHaveTextContent('...');
  await waitFor(() => expect(heading).toHaveTextContent('My Account Name | $86,753.09'));
});

test('should display transactions', async () => {
  render();
  await waitFor(() =>
    expect(screen.getByRole('cell', { name: 'Darth Vader' })).toBeInTheDocument(),
  );
});
