import { configure, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import CreateTransactionDialog from './CreateTransactionDialog';

const accountCategories = {
  categories: [
    {
      id: 1,
      name: 'Accounts',
      accounts: [
        { id: 2, name: 'Account 1' },
        { id: 3, name: 'Account 2' },
      ],
    },
  ],
};

const envelopeCategories = {
  categories: [
    {
      id: 4,
      name: 'Envelopes',
      envelopes: [
        { id: 5, name: 'Envelope 1' },
        { id: 6, name: 'Envelope 2' },
        { id: 7, name: 'Envelope 3' },
      ],
    },
  ],
};

const render = () => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  const mock = new MockAdapter(axios);
  mock.onGet('/api/ledgers/2').reply(200, { currency: 840 });
  mock.onGet('/api/ledgers/2/account-categories').reply(200, accountCategories);
  mock.onGet('/api/ledgers/2/envelope-categories').reply(200, envelopeCategories);

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <CreateTransactionDialog />
      </QueryClientProvider>,
    ),
    invalidateQueries,
    mock,
    queryClient,
  };
};

test('should initialize to empty transaction', async () => {
  const { mock } = render();
  await waitFor(() => expect(mock.history.get.length).toBe(3));

  expect(screen.getByRole('heading', { name: /create transaction/i })).toBeInTheDocument();

  // Empty select field
  expect(screen.getByRole('button', { name: /type /i })).toBeInTheDocument();

  expect(screen.getByRole('textbox', { name: /payee/i })).toHaveDisplayValue('');

  // setupTests.js uses MockDate to set it to 2021-06-24, but for some reason the
  // date picker thinks today is the 23rd
  expect(screen.getByRole('textbox', { name: /date/i })).toHaveDisplayValue('2021-06-23');

  expect(screen.getByRole('textbox', { name: /account/i })).toHaveDisplayValue('');

  expect(screen.getByRole('checkbox')).not.toBeChecked();

  expect(screen.getByRole('textbox', { name: /envelope/i })).toHaveDisplayValue('');

  const memos = screen.getAllByRole('textbox', { name: /memo/i });
  expect(memos).toHaveLength(2);
  memos.forEach((memo) => expect(memo).toHaveDisplayValue(''));

  const amounts = screen.getAllByRole('textbox', { name: /amount/i });
  expect(amounts).toHaveLength(2);
  amounts.forEach((amount) => expect(amount).toHaveDisplayValue('$0.00'));

  expect(screen.getByRole('button', { name: /delete account split/i })).toBeDisabled();
  expect(screen.getByRole('button', { name: /delete envelope split/i })).toBeDisabled();
  expect(screen.getByRole('button', { name: /create/i })).toBeDisabled();
});

test('should create income transaction', async () => {
  const { invalidateQueries, mock } = render();
  mock.onPost('/api/ledgers/2/transactions').reply(201);
  await waitFor(() => expect(mock.history.get.length).toBe(3));

  const amounts = screen.getAllByRole('textbox', { name: /amount/i });
  fireEvent.change(amounts[0], { target: { value: '$12.34' } });

  await waitFor(() =>
    expect(screen.getByRole('button', { name: /type income/i })).toBeInTheDocument(),
  );
  expect(amounts[1]).toHaveDisplayValue('$12.34');

  userEvent.type(screen.getByRole('textbox', { name: /payee/i }), 'payday');
  userEvent.type(screen.getByRole('textbox', { name: /account/i }), 'Accounts:Account 1');
  userEvent.type(screen.getByRole('textbox', { name: /envelope/i }), 'Envelopes:Envelope 1');
  userEvent.tab();

  const create = screen.getByRole('button', { name: /create/i });
  await waitFor(() => expect(create).toBeEnabled());

  userEvent.click(create);
  await waitFor(() => expect(mock.history.post.length).toBe(1));
  expect(JSON.parse(mock.history.post[0].data)).toEqual({
    type: 'income',
    payee: 'payday',
    recordedDate: '2021-06-23',
    accountTransactions: [
      {
        accountId: 2,
        memo: '',
        cleared: false,
        amount: 1234,
      },
    ],
    envelopeTransactions: [
      {
        envelopeId: 5,
        memo: '',
        amount: 1234,
      },
    ],
  });
  expect(invalidateQueries).toHaveBeenCalledTimes(4);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-balance', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-transactions', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '5']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '5']);
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /create transaction/i })).not.toBeInTheDocument(),
  );
}, 15000);

test('should create expense transaction', async () => {
  const { invalidateQueries, mock } = render();
  mock.onPost('/api/ledgers/2/transactions').reply(201);
  await waitFor(() => expect(mock.history.get.length).toBe(3));

  const amounts = screen.getAllByRole('textbox', { name: /amount/i });
  fireEvent.change(amounts[1], { target: { value: '-$12.34' } });

  await waitFor(() =>
    expect(screen.getByRole('button', { name: /type expense/i })).toBeInTheDocument(),
  );
  expect(amounts[0]).toHaveDisplayValue('-$12.34');

  userEvent.type(screen.getByRole('textbox', { name: /payee/i }), 'groceries');
  fireEvent.change(screen.getByRole('textbox', { name: /date/i }), {
    target: { value: '2021-06-07' },
  });
  userEvent.type(screen.getByRole('textbox', { name: /account/i }), 'Accounts:Account 2');
  userEvent.click(screen.getByRole('checkbox'));
  userEvent.type(screen.getByRole('textbox', { name: /envelope/i }), 'Envelopes:Envelope 2');
  userEvent.type(screen.getAllByRole('textbox', { name: /memo/i })[1], 'food for party');
  userEvent.tab();

  const create = screen.getByRole('button', { name: /create/i });
  await waitFor(() => expect(create).toBeEnabled());

  userEvent.click(create);
  await waitFor(() => expect(mock.history.post.length).toBe(1));
  expect(JSON.parse(mock.history.post[0].data)).toEqual({
    type: 'expense',
    payee: 'groceries',
    recordedDate: '2021-06-07',
    accountTransactions: [
      {
        accountId: 3,
        memo: '',
        cleared: true,
        amount: -1234,
      },
    ],
    envelopeTransactions: [
      {
        envelopeId: 6,
        memo: 'food for party',
        amount: -1234,
      },
    ],
  });
  expect(invalidateQueries).toHaveBeenCalledTimes(4);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-balance', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-transactions', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '6']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '6']);
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /create transaction/i })).not.toBeInTheDocument(),
  );
}, 15000);

test('should create multi-split expense transaction', async () => {
  const { invalidateQueries, mock } = render();
  mock.onPost('/api/ledgers/2/transactions').reply(201);
  await waitFor(() => expect(mock.history.get.length).toBe(3));

  userEvent.click(screen.getByRole('button', { name: /add envelope/i }));
  userEvent.click(screen.getByRole('button', { name: /add envelope/i }));

  const amounts = screen.getAllByRole('textbox', { name: /amount/i });
  expect(amounts).toHaveLength(4);
  fireEvent.change(amounts[0], { target: { value: '-$100.00' } });
  fireEvent.change(amounts[1], { target: { value: '-$12.34' } });
  fireEvent.change(amounts[2], { target: { value: '-$12.66' } });
  fireEvent.change(amounts[3], { target: { value: '-$75.00' } });

  userEvent.type(screen.getByRole('textbox', { name: /payee/i }), 'online order');
  userEvent.type(screen.getByRole('textbox', { name: /account/i }), 'Accounts:Account 1');

  const envelopes = screen.getAllByRole('textbox', { name: /envelope/i });
  expect(envelopes).toHaveLength(3);
  userEvent.type(envelopes[0], 'Envelopes:Envelope 1');
  userEvent.type(envelopes[1], 'Envelopes:Envelope 2');
  userEvent.type(envelopes[2], 'Envelopes:Envelope 3');
  userEvent.tab();

  const create = screen.getByRole('button', { name: /create/i });
  await waitFor(() => expect(create).toBeEnabled());

  userEvent.click(create);
  await waitFor(() => expect(mock.history.post.length).toBe(1));
  expect(JSON.parse(mock.history.post[0].data)).toEqual({
    type: 'expense',
    payee: 'online order',
    recordedDate: '2021-06-23',
    accountTransactions: [
      {
        accountId: 2,
        memo: '',
        cleared: false,
        amount: -10000,
      },
    ],
    envelopeTransactions: [
      {
        envelopeId: 5,
        memo: '',
        amount: -1234,
      },
      {
        envelopeId: 6,
        memo: '',
        amount: -1266,
      },
      {
        envelopeId: 7,
        memo: '',
        amount: -7500,
      },
    ],
  });
  expect(invalidateQueries).toHaveBeenCalledTimes(8);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-balance', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-transactions', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '5']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '5']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '6']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '6']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '7']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '7']);
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /create transaction/i })).not.toBeInTheDocument(),
  );
}, 15000);

test('should create transfer transaction', async () => {
  const { invalidateQueries, mock } = render();
  mock.onPost('/api/ledgers/2/transactions').reply(201);
  await waitFor(() => expect(mock.history.get.length).toBe(3));

  userEvent.click(screen.getByRole('button', { name: /add account/i }));
  userEvent.click(screen.getByRole('button', { name: /delete envelope split/i }));

  const amounts = screen.getAllByRole('textbox', { name: /amount/i });
  fireEvent.change(amounts[0], { target: { value: '-$12.34' } });

  await waitFor(() => expect(amounts[1]).toHaveDisplayValue('$12.34'));
  expect(screen.getByRole('button', { name: /type account-to-account/i })).toBeInTheDocument();

  fireEvent.change(amounts[1], { target: { value: '-$43.21' } });

  await waitFor(() => expect(amounts[0]).toHaveDisplayValue('$43.21'));

  userEvent.type(screen.getByRole('textbox', { name: /payee/i }), 'pay credit card');

  const accounts = screen.getAllByRole('textbox', { name: /account/i });
  userEvent.type(accounts[0], 'Accounts:Account 2');
  userEvent.type(accounts[1], 'Accounts:Account 1');

  userEvent.click(screen.getAllByRole('checkbox')[1]);

  userEvent.type(screen.getAllByRole('textbox', { name: /memo/i })[0], 'some note');
  userEvent.tab();

  const create = screen.getByRole('button', { name: /create/i });
  await waitFor(() => expect(create).toBeEnabled());

  userEvent.click(create);
  await waitFor(() => expect(mock.history.post.length).toBe(1));
  expect(JSON.parse(mock.history.post[0].data)).toEqual({
    type: 'transfer',
    payee: 'pay credit card',
    recordedDate: '2021-06-23',
    accountTransactions: [
      {
        accountId: 3,
        memo: 'some note',
        cleared: false,
        amount: 4321,
      },
      {
        accountId: 2,
        memo: '',
        cleared: true,
        amount: -4321,
      },
    ],
    envelopeTransactions: [],
  });
  expect(invalidateQueries).toHaveBeenCalledTimes(4);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-balance', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-transactions', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-balance', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-transactions', '3']);
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /create transaction/i })).not.toBeInTheDocument(),
  );
}, 15000);

test('should create allocation transaction', async () => {
  const { invalidateQueries, mock } = render();
  mock.onPost('/api/ledgers/2/transactions').reply(201);
  await waitFor(() => expect(mock.history.get.length).toBe(3));

  userEvent.click(screen.getByRole('button', { name: /add envelope/i }));
  userEvent.click(screen.getByRole('button', { name: /delete account split/i }));

  const amounts = screen.getAllByRole('textbox', { name: /amount/i });
  fireEvent.change(amounts[0], { target: { value: '-$12.34' } });

  await waitFor(() => expect(amounts[1]).toHaveDisplayValue('$12.34'));
  expect(
    screen.getByRole('button', { name: /type envelope-to-envelope \(budgeted\)/i }),
  ).toBeInTheDocument();

  fireEvent.change(amounts[1], { target: { value: '-$43.21' } });

  await waitFor(() => expect(amounts[0]).toHaveDisplayValue('$43.21'));

  userEvent.type(screen.getByRole('textbox', { name: /payee/i }), 'refill envelope');

  const envelopes = screen.getAllByRole('textbox', { name: /envelope/i });
  userEvent.type(envelopes[1], 'Envelopes:Envelope 2');
  userEvent.type(envelopes[0], 'Envelopes:Envelope 1');

  userEvent.type(screen.getAllByRole('textbox', { name: /memo/i })[1], 'memo omem');
  userEvent.tab();

  const create = screen.getByRole('button', { name: /create/i });
  await waitFor(() => expect(create).toBeEnabled());

  userEvent.click(create);
  await waitFor(() => expect(mock.history.post.length).toBe(1));
  expect(JSON.parse(mock.history.post[0].data)).toEqual({
    type: 'allocation',
    payee: 'refill envelope',
    recordedDate: '2021-06-23',
    accountTransactions: [],
    envelopeTransactions: [
      {
        envelopeId: 5,
        memo: '',
        amount: 4321,
      },
      {
        envelopeId: 6,
        memo: 'memo omem',
        amount: -4321,
      },
    ],
  });
  expect(invalidateQueries).toHaveBeenCalledTimes(4);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '5']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '5']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '6']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '6']);
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /create transaction/i })).not.toBeInTheDocument(),
  );
}, 15000);

test('should assist with balancing transaction', async () => {
  const { mock } = render();
  await waitFor(() => expect(mock.history.get.length).toBe(3));

  userEvent.click(screen.getByRole('button', { name: /add envelope/i }));

  // Auto-balance on account side
  let amounts = screen.getAllByRole('textbox', { name: /amount/i });
  expect(amounts).toHaveLength(3);
  fireEvent.change(amounts[0], { target: { value: '$1234.56' } });
  userEvent.tab();

  const imbalancedText = 'Sum of account splits does not equal sum of envelope splits';

  await waitFor(() => expect(screen.getByText(imbalancedText)).toBeInTheDocument());
  expect(screen.getByRole('button', { name: /add balance \(\$1,234\.56\)/i })).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: /add balance \(-\$1,234\.56\)/i }));

  await waitFor(() => expect(screen.queryByText(imbalancedText)).not.toBeInTheDocument());
  expect(screen.queryAllByRole('textbox', { name: /account/i })).toHaveLength(2);
  expect(screen.queryAllByRole('textbox', { name: /envelope/i })).toHaveLength(2);
  expect(screen.queryByRole('button', { name: /add balance.*/i })).not.toBeInTheDocument();
  amounts = screen.getAllByRole('textbox', { name: /amount/i });
  expect(amounts).toHaveLength(4);
  expect(amounts[0]).toHaveDisplayValue('$1,234.56');
  expect(amounts[1]).toHaveDisplayValue('-$1,234.56');
  expect(amounts[2]).toHaveDisplayValue('$0.00');
  expect(amounts[3]).toHaveDisplayValue('$0.00');

  // Auto-balance on envelope side
  userEvent.click(screen.getAllByRole('button', { name: /delete account split/i })[0]);

  await waitFor(() => expect(screen.getByText(imbalancedText)).toBeInTheDocument());
  expect(screen.getByRole('button', { name: /add balance \(\$1,234\.56\)/i })).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: /add balance \(-\$1,234\.56\)/i }));

  await waitFor(() => expect(screen.queryByText(imbalancedText)).not.toBeInTheDocument());
  expect(screen.queryAllByRole('textbox', { name: /account/i })).toHaveLength(1);
  expect(screen.queryAllByRole('textbox', { name: /envelope/i })).toHaveLength(3);
  expect(screen.queryByRole('button', { name: /add balance.*/i })).not.toBeInTheDocument();
  amounts = screen.getAllByRole('textbox', { name: /amount/i });
  expect(amounts).toHaveLength(4);
  expect(amounts[0]).toHaveDisplayValue('-$1,234.56');
  expect(amounts[1]).toHaveDisplayValue('$0.00');
  expect(amounts[2]).toHaveDisplayValue('$0.00');
  expect(amounts[3]).toHaveDisplayValue('-$1,234.56');
}, 15000);
