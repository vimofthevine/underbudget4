import { configure, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moment from 'moment';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Routes } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import createMediaQuery from 'tests/createMediaQuery';
import renderWithRouter from 'tests/renderWithRouter';
import useFetchAccountTransactions from '../../hooks/useFetchAccountTransactions';
import TransactionHistory from '../TransactionHistory';

const createTransactions = ({ cleared, date = null, from, to, type }) => {
  const transactions = [];
  let i = to;
  while (i > from) {
    transactions.push({
      id: i,
      transactionId: 100 + i,
      recordedDate: date !== null ? date : moment('2021-04-01').add(i, 'days').format('YYYY-MM-DD'),
      type,
      payee: `Vendor ${i}`,
      memo: `Memo ${i}`,
      cleared,
      amount: 1000,
      balance: 1000 * (i + 1),
    });
    i -= 1;
  }
  return transactions;
};

const render = ({
  cleared = false,
  hasCleared = false,
  get = [],
  route = '/account/3',
  type = 'income',
  width = '800px',
} = {}) => {
  window.HTMLElement.prototype.scrollTo = () => 0;
  window.matchMedia = createMediaQuery(width);

  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const mockAxios = new MockAdapter(axios);

  mockAxios.onGet('/api/ledgers/2').reply(200, { currency: 840 });

  mockAxios.onGet(/\/api\/transactions\/\d+/).reply(200, {
    accountTransactions: [{ id: 2, accountId: 2, memo: '', amount: -1450 }],
    envelopeTransactions: [{ id: 5, envelopeId: 2, memo: '', amount: -1450 }],
  });

  get.forEach(
    ({
      code = 200,
      date = null,
      from = 0,
      to = 0,
      total = 0,
      url = /\/api\/accounts\/3\/transactions.*/,
    }) => {
      mockAxios.onGet(url).reply(code, {
        transactions: createTransactions({ cleared, date, from, to, type }),
        total,
      });
    },
  );

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path='account/:id'
            element={
              <TransactionHistory
                hasCleared={hasCleared}
                useFetchTransactions={useFetchAccountTransactions}
              />
            }
          />
        </Routes>
      </QueryClientProvider>,
      { route },
    ),
    mockAxios,
    queryClient,
  };
};

test('should display error message when request fails', async () => {
  render({ get: [{ code: 500 }] });
  await waitFor(() => expect(screen.queryByRole('alert')).toBeInTheDocument());
  expect(screen.getByText(/an error occurred on the server/i)).toBeInTheDocument();
});

test('should display paginated transactions on desktop', async () => {
  render({
    get: [
      { from: 30, to: 55, total: 55, url: '/api/accounts/3/transactions?page=1&size=25' },
      { from: 5, to: 30, total: 55, url: '/api/accounts/3/transactions?page=2&size=25' },
      { from: 0, to: 5, total: 55, url: '/api/accounts/3/transactions?page=3&size=25' },
    ],
  });

  await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  expect(screen.queryAllByRole('row')).toHaveLength(51); // 2 rows per transaction + header

  expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
  userEvent.click(screen.getByRole('button', { name: /next page/i }));

  await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  expect(screen.queryAllByRole('row')).toHaveLength(51); // 2 rows per transaction + header

  expect(screen.getByRole('button', { name: /previous page/i })).toBeEnabled();
  userEvent.click(screen.getByRole('button', { name: /next page/i }));

  await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  expect(screen.queryAllByRole('row')).toHaveLength(11); // 2 rows per transaction + header

  expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
  userEvent.click(screen.getByRole('button', { name: /previous page/i }));

  await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  expect(screen.queryAllByRole('row')).toHaveLength(51); // 2 rows per transaction + header
}, 30000);

test('should display transactions without cleared column on desktop', async () => {
  render({ get: [{ to: 1 }], hasCleared: false });

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(3);

  const header = within(rows[0]);
  expect(header.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Payee' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Memo' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Amount' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Balance' })).toBeInTheDocument();
  expect(header.queryByRole('columnheader', { name: 'Cleared' })).not.toBeInTheDocument();

  const row = within(rows[1]);
  expect(row.getByRole('cell', { name: '2021-04-02' })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: 'Vendor 1' })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: 'Memo 1' })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: '$10.00' })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: '$20.00' })).toBeInTheDocument();
  expect(row.queryByRole('cell', { name: /cleared/i })).not.toBeInTheDocument();
});

test('should display cleared transactions on desktop', async () => {
  render({ cleared: true, get: [{ to: 1 }], hasCleared: true });

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(3);

  const header = within(rows[0]);
  expect(header.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Payee' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Memo' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Cleared' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Amount' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Balance' })).toBeInTheDocument();

  const row = within(rows[1]);
  expect(row.getByRole('cell', { name: '2021-04-02' })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: 'Vendor 1' })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: 'Memo 1' })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: /^cleared/i })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: '$10.00' })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: '$20.00' })).toBeInTheDocument();
});

test('should display uncleared transactions on desktop', async () => {
  render({ cleared: false, get: [{ to: 1 }], hasCleared: true });

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(3);

  const header = within(rows[0]);
  expect(header.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Payee' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Memo' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Cleared' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Amount' })).toBeInTheDocument();
  expect(header.getByRole('columnheader', { name: 'Balance' })).toBeInTheDocument();

  const row = within(rows[1]);
  expect(row.getByRole('cell', { name: '2021-04-02' })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: 'Vendor 1' })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: 'Memo 1' })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: /uncleared/i })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: '$10.00' })).toBeInTheDocument();
  expect(row.getByRole('cell', { name: '$20.00' })).toBeInTheDocument();
});

test('should display details in expandable sub-table on desktop', async () => {
  render({ get: [{ to: 1 }] });

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(3);

  const trnRow = within(rows[1]);
  const detailsRow = within(rows[2]);

  expect(detailsRow.queryByRole('table')).not.toBeInTheDocument();

  userEvent.click(trnRow.getByRole('cell', { name: 'Vendor 1' }));

  await waitFor(() => expect(detailsRow.getByRole('table')).toBeInTheDocument());
  expect(detailsRow.getAllByRole('cell', { name: '-$14.50' })).toHaveLength(2);
});

test('should navigate to modify-transaction route when modify button clicked', async () => {
  const { history } = render({ get: [{ to: 1 }] });

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(3);

  const row = within(rows[1]);
  userEvent.click(row.getByRole('button', { name: /modify transaction/i }));

  expect(history.location.pathname).toBe('/account/3/modify-transaction/101');
});

test('should display paginated transactions on mobile', async () => {
  render({
    get: [
      { from: 30, to: 55, total: 55, url: '/api/accounts/3/transactions?page=1&size=25' },
      { from: 5, to: 30, total: 55, url: '/api/accounts/3/transactions?page=2&size=25' },
      { from: 0, to: 5, total: 55, url: '/api/accounts/3/transactions?page=3&size=25' },
    ],
    width: '400px',
  });

  await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  expect(screen.queryAllByRole('row')).toHaveLength(50); // 2 rows per transaction

  expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
  userEvent.click(screen.getByRole('button', { name: /next page/i }));

  await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  expect(screen.queryAllByRole('row')).toHaveLength(50); // 2 rows per transaction

  expect(screen.getByRole('button', { name: /previous page/i })).toBeEnabled();
  userEvent.click(screen.getByRole('button', { name: /next page/i }));

  await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  expect(screen.queryAllByRole('row')).toHaveLength(10); // 2 rows per transaction

  expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
  userEvent.click(screen.getByRole('button', { name: /previous page/i }));

  await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  expect(screen.queryAllByRole('row')).toHaveLength(50); // 2 rows per transaction + header
}, 30000);

test('should group transactions by date on mobile', async () => {
  render({ get: [{ date: '2021-04-25', to: 2 }], width: '400px' });

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(3);

  const dateRow = within(rows[0]);
  expect(dateRow.getByRole('cell', { name: '2021-04-25' })).toBeInTheDocument();

  const trn1Row = within(rows[1]);
  expect(trn1Row.getByRole('cell', { name: 'Vendor 2' })).toBeInTheDocument();
  expect(trn1Row.getByRole('cell', { name: '$10.00' })).toBeInTheDocument();

  const trn2Row = within(rows[2]);
  expect(trn2Row.getByRole('cell', { name: 'Vendor 1' })).toBeInTheDocument();
  expect(trn2Row.getByRole('cell', { name: '$10.00' })).toBeInTheDocument();
});

test('should navigate to transaction details route when row clicked on mobile', async () => {
  const { history } = render({ get: [{ to: 1 }], width: '400px' });

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(2);

  const row = within(rows[1]);
  userEvent.click(row.getByRole('cell', { name: 'Vendor 1' }));

  expect(history.location.pathname).toBe('/account/3/transaction/101');
});
