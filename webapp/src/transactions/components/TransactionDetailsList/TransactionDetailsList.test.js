import { configure, screen, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from '../../../ledgers/utils/setSelectedLedger';
import renderWithRouter from '../../../tests/renderWithRouter';
import TransactionDetailsList from './TransactionDetailsList';

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
  mockAxios.onGet('/api/ledgers/2').reply(200, { currency: 840 });
  mockAxios.onGet('/api/transactions/7').reply(code, transaction);
  mockAxios.onGet('/api/ledgers/2/account-categories').reply(200, accounts);
  mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(200, envelopes);

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <TransactionDetailsList id={7} />
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
    payee: 'Vendor Name',
    recordedDate: '2021-05-10',
    accountTransactions: [{ id: 1, accountId: 2, memo: '', cleared: false, amount: 1450 }],
    envelopeTransactions: [{ id: 2, envelopeId: 3, memo: '', amount: 1450 }],
  };

  render(incomeTransaction);

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const items = screen.queryAllByRole('listitem');
  expect(items).toHaveLength(5);
  expect(items[0]).toHaveTextContent('Vendor Name2021-05-10');
  expect(items[1]).toHaveTextContent('Accounts')
  expect(items[2]).toHaveTextContent('Category 1:Account 2$14.50')
  expect(items[3]).toHaveTextContent('Envelopes')
  expect(items[4]).toHaveTextContent('Category 2:Envelope 3$14.50')
});

test('should display simple expense transaction', async () => {
  const simpleExpenseTransaction = {
    payee: 'Vendor Name',
    recordedDate: '2021-05-10',
    accountTransactions: [{ id: 1, accountId: 4, memo: '', amount: -314159 }],
    envelopeTransactions: [{ id: 2, envelopeId: 1, memo: '', amount: -314159 }],
  };

  render(simpleExpenseTransaction);

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const items = screen.queryAllByRole('listitem');
  expect(items).toHaveLength(5);
  expect(items[0]).toHaveTextContent('Vendor Name2021-05-10');
  expect(items[1]).toHaveTextContent('Accounts');
  expect(items[2]).toHaveTextContent('Category 3:Account 4-$3,141.59');
  expect(items[3]).toHaveTextContent('Envelopes');
  expect(items[4]).toHaveTextContent('Category 2:Envelope 1-$3,141.59');
});

test('should display split expense transaction', async () => {
  const splitExpenseTransaction = {
    payee: 'Vendor Name',
    recordedDate: '2021-05-10',
    accountTransactions: [{ id: 1, accountId: 1, memo: '', amount: -10000 }],
    envelopeTransactions: [
      { id: 2, envelopeId: 2, memo: 'Memo 1', amount: -7500 },
      { id: 3, envelopeId: 4, memo: 'Memo 2', amount: -2500 },
    ],
  };

  render(splitExpenseTransaction);

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const items = screen.queryAllByRole('listitem');
  expect(items).toHaveLength(6);
  expect(items[0]).toHaveTextContent('Vendor Name2021-05-10');
  expect(items[1]).toHaveTextContent('Accounts');
  expect(items[2]).toHaveTextContent('Category 1:Account 1-$100.00');
  expect(items[3]).toHaveTextContent('Envelopes');
  expect(items[4]).toHaveTextContent('Category 2:Envelope 2Memo 1-$75.00');
  expect(items[5]).toHaveTextContent('Category 3:Envelope 4Memo 2-$25.00');
});

test('should display transfer transaction', async () => {
  const transferTransaction = {
    payee: 'Vendor Name',
    recordedDate: '2021-05-10',
    accountTransactions: [
      { id: 1, accountId: 3, memo: '', cleared: true, amount: 87654 },
      { id: 2, accountId: 4, memo: '', amount: -87654 },
    ],
    envelopeTransactions: [],
  };

  render(transferTransaction);

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const items = screen.queryAllByRole('listitem');
  expect(items).toHaveLength(4);
  expect(items[0]).toHaveTextContent('Vendor Name2021-05-10');
  expect(items[1]).toHaveTextContent('Accounts');
  expect(items[2]).toHaveTextContent('Category 3:Account 3$876.54');
  expect(items[3]).toHaveTextContent('Category 3:Account 4-$876.54');
});

test('should display allocation transaction', async () => {
  const allocationTransaction = {
    payee: 'Vendor Name',
    recordedDate: '2021-05-10',
    accountTransactions: [],
    envelopeTransactions: [
      { id: 2, envelopeId: 2, memo: '', amount: -1500 },
      { id: 3, envelopeId: 1, memo: '', amount: 1500 },
    ],
  };

  render(allocationTransaction);

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const items = screen.queryAllByRole('listitem');
  expect(items).toHaveLength(4);
  expect(items[0]).toHaveTextContent('Vendor Name2021-05-10');
  expect(items[1]).toHaveTextContent('Envelopes');
  expect(items[2]).toHaveTextContent('Category 2:Envelope 2-$15.00');
  expect(items[3]).toHaveTextContent('Category 2:Envelope 1$15.00');
});
