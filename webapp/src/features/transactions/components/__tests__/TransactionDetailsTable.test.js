import { configure, screen, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import TransactionDetailsTable from '../TransactionDetailsTable';

const formatMoney = (v) =>
  new Intl.NumberFormat(undefined, { currency: 'USD', style: 'currency' }).format(v / 100);

const accounts = {
  categories: [
    {
      id: 1,
      name: 'Category 1',
      accounts: [
        { id: 1, name: 'Account 1' },
        { id: 2, name: 'Account 2' },
      ],
    },
    {
      id: 2,
      name: 'Category 2',
      accounts: [],
    },
    {
      id: 3,
      name: 'Category 3',
      accounts: [
        { id: 3, name: 'Account 3' },
        { id: 4, name: 'Account 4' },
      ],
    },
  ],
};

const envelopes = {
  categories: [
    {
      id: 1,
      name: 'Category 1',
      envelopes: [],
    },
    {
      id: 2,
      name: 'Category 2',
      envelopes: [
        { id: 1, name: 'Envelope 1' },
        { id: 2, name: 'Envelope 2' },
        { id: 3, name: 'Envelope 3' },
      ],
    },
    {
      id: 3,
      name: 'Category 3',
      envelopes: [{ id: 4, name: 'Envelope 4' }],
    },
  ],
};

const render = (transaction, code = 200) => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/transactions/7').reply(code, transaction);
  mockAxios.onGet('/api/ledgers/2/account-categories').reply(200, accounts);
  mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(200, envelopes);

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <TransactionDetailsTable formatMoney={formatMoney} id={7} />
      </QueryClientProvider>,
    ),
    mockAxios,
    queryClient,
  };
};

const verifyHeader = (row) => {
  const cells = within(row).getAllByRole('columnheader');
  expect(cells).toHaveLength(4);
  expect(cells[0]).toHaveTextContent('Name');
  expect(cells[1]).toHaveTextContent('Memo');
  expect(cells[2]).toHaveTextContent('Cleared');
  expect(cells[3]).toHaveTextContent('Amount');
};

const verifyIsAccountsRow = (row) => {
  const cells = within(row).getAllByRole('cell');
  expect(cells).toHaveLength(1);
  expect(cells[0]).toHaveTextContent('Accounts');
};

const verifyTransactionRow = (row, name, memo, isCleared, amount) => {
  const cells = within(row).getAllByRole('cell');
  expect(cells).toHaveLength(4);
  expect(cells[0]).toHaveTextContent(name);
  expect(cells[1]).toHaveTextContent(memo);
  if (isCleared) {
    expect(cells[2]).not.toBeEmptyDOMElement();
  } else {
    expect(cells[2]).toBeEmptyDOMElement();
  }
  expect(cells[3]).toHaveTextContent(amount);
};

const verifyIsEnvelopesRow = (row) => {
  const cells = within(row).getAllByRole('cell');
  expect(cells).toHaveLength(1);
  expect(cells[0]).toHaveTextContent('Envelopes');
};

test('should display error message if unable to fetch transaction', async () => {
  render({}, 404);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  expect(screen.getByText(/unable to retrieve transaction details/i)).toBeInTheDocument();
});

test('should display income transaction', async () => {
  const incomeTransaction = {
    accountTransactions: [{ id: 1, accountId: 2, memo: '', cleared: false, amount: 1450 }],
    envelopeTransactions: [{ id: 2, envelopeId: 3, memo: '', amount: 1450 }],
  };

  render(incomeTransaction);

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(5);
  verifyHeader(rows[0]);
  verifyIsAccountsRow(rows[1]);
  verifyTransactionRow(rows[2], 'Category 1:Account 2', '', false, '$14.50');
  verifyIsEnvelopesRow(rows[3]);
  verifyTransactionRow(rows[4], 'Category 2:Envelope 3', '', false, '$14.50');
});

test('should display simple expense transaction', async () => {
  const simpleExpenseTransaction = {
    accountTransactions: [{ id: 1, accountId: 4, memo: '', amount: -314159 }],
    envelopeTransactions: [{ id: 2, envelopeId: 1, memo: '', amount: -314159 }],
  };

  render(simpleExpenseTransaction);

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(5);
  verifyHeader(rows[0]);
  verifyIsAccountsRow(rows[1]);
  verifyTransactionRow(rows[2], 'Category 3:Account 4', '', false, '-$3,141.59');
  verifyIsEnvelopesRow(rows[3]);
  verifyTransactionRow(rows[4], 'Category 2:Envelope 1', '', false, '-$3,141.59');
});

test('should display split expense transaction', async () => {
  const splitExpenseTransaction = {
    accountTransactions: [{ id: 1, accountId: 1, memo: '', amount: -10000 }],
    envelopeTransactions: [
      { id: 2, envelopeId: 2, memo: 'Memo 1', amount: -7500 },
      { id: 3, envelopeId: 4, memo: 'Memo 2', amount: -2500 },
    ],
  };

  render(splitExpenseTransaction);

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(6);
  verifyHeader(rows[0]);
  verifyIsAccountsRow(rows[1]);
  verifyTransactionRow(rows[2], 'Category 1:Account 1', '', false, '-$100.00');
  verifyIsEnvelopesRow(rows[3]);
  verifyTransactionRow(rows[4], 'Category 2:Envelope 2', 'Memo 1', false, '-$75.00');
  verifyTransactionRow(rows[5], 'Category 3:Envelope 4', 'Memo 2', false, '-$25.00');
});

test('should display transfer transaction', async () => {
  const transferTransaction = {
    accountTransactions: [
      { id: 1, accountId: 3, memo: '', cleared: true, amount: 87654 },
      { id: 2, accountId: 4, memo: '', amount: -87654 },
    ],
    envelopeTransactions: [],
  };

  render(transferTransaction);

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(4);
  verifyHeader(rows[0]);
  verifyIsAccountsRow(rows[1]);
  verifyTransactionRow(rows[2], 'Category 3:Account 3', '', true, '$876.54');
  verifyTransactionRow(rows[3], 'Category 3:Account 4', '', false, '-$876.54');
});

test('should display allocation transaction', async () => {
  const allocationTransaction = {
    accountTransactions: [],
    envelopeTransactions: [
      { id: 2, envelopeId: 2, memo: '', amount: -1500 },
      { id: 3, envelopeId: 1, memo: '', amount: 1500 },
    ],
  };

  render(allocationTransaction);

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const rows = screen.queryAllByRole('row');
  expect(rows).toHaveLength(4);
  verifyHeader(rows[0]);
  verifyIsEnvelopesRow(rows[1]);
  verifyTransactionRow(rows[2], 'Category 2:Envelope 2', '', false, '-$15.00');
  verifyTransactionRow(rows[3], 'Category 2:Envelope 1', '', false, '$15.00');
});
