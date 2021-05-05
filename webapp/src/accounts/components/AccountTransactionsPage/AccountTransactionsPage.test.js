import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  mockAxios.onGet('/api/accounts/7/balance').reply(200, { balance: 8675309, total: 472 });
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

test('should display modify-account dialog if initial route matches', async () => {
  const { history } = render({ route: '/account/1/modify' });
  expect(screen.getByRole('heading', { name: /modify account/i })).toBeInTheDocument();

  await waitFor(() => expect(history.location.pathname).toBe('/account/1'));
  expect(screen.queryByRole('heading', { name: /modify account/i })).not.toBeInTheDocument();
});

test('should prompt to confirm deletion of account', async () => {
  const { mockAxios, queryClient } = render();
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
  mockAxios.onDelete('/api/accounts/7').reply(204);

  await waitFor(() => expect(screen.getByRole('heading')).toHaveTextContent('My Account Name | $86,753.09'));

  // Reject cancellation
  userEvent.click(screen.getByRole('button', { name: /open actions menu/i }));
  userEvent.click(screen.getByRole('menuitem', { name: /delete account/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /cancel/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  expect(mockAxios.history.delete).toHaveLength(0);

  // Confirm cancellation
  userEvent.click(screen.getByRole('button', { name: /open actions menu/i }));
  userEvent.click(screen.getByRole('menuitem', { name: /delete account/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /ok/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(mockAxios.history.delete).toHaveLength(1));
  expect(mockAxios.history.delete[0].url).toBe('/api/accounts/7');
  expect(invalidateQueries).toHaveBeenCalledWith(['account-categories', { ledger: '2' }]);
});

// TODO implement these tests
// test('should archive account', async () => {});

// test('should unarchive account', async () => {});

test('should open dialogs when using nav bar actions', async () => {
  const { history } = render();

  // Make sure no dialogs open initially
  expect(screen.queryAllByRole('heading')).toHaveLength(1);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /modify account$/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify account/i })).toBeInTheDocument(),
  );
  expect(history.location.pathname).toBe('/account/7/modify');

  // TODO open create-transaction dialog
});

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
