import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import FullTransactionsTable from '../FullTransactionsTable';

export default {
  title: 'transactions/FullTransactionsTable',
  component: FullTransactionsTable,
  decorators: [
    (story) => {
      const mockAxios = new MockAdapter(axios, { delayResponse: 1000 });
      mockAxios.onGet(/\/api\/transactions\/\d+/).reply(200, {
        accountTransactions: [
          {
            id: 2,
            accountId: 2,
            memo: '',
            amount: -1450,
          },
        ],
        envelopeTransactions: [
          {
            id: 5,
            envelopeId: 2,
            memo: '',
            amount: -1450,
          },
        ],
      });

      return story();
    },
  ],
};

const Template = (args) => <FullTransactionsTable {...args} />;
Template.args = {
  formatMoney: (v) =>
    new Intl.NumberFormat(undefined, { currency: 'USD', style: 'currency' }).format(v / 100),
};

export const NoTransactions = Template.bind({});

export const OneTransaction = Template.bind({});
OneTransaction.args = {
  ...Template.args,
  transactions: [
    {
      id: 12,
      transactionId: 12,
      recordedDate: '2021-04-26',
      payee: 'Grocer',
      type: 'expense',
      memo: 'baking supplies',
      cleared: false,
      amount: -1674,
      balance: 51244,
    },
  ],
};

export const SeveralTransactions = Template.bind({});
SeveralTransactions.args = {
  ...Template.args,
  transactions: [
    OneTransaction.args.transactions[0],
    {
      id: 11,
      transactionId: 12,
      recordedDate: '2021-04-26',
      payee: 'Gas',
      type: 'expense',
      memo: '',
      cleared: false,
      amount: -2000,
      balance: 53244,
    },
    {
      id: 10,
      transactionId: 12,
      recordedDate: '2021-04-24',
      payee: 'Rent',
      type: 'expense',
      memo: '',
      cleared: true,
      amount: -64579,
      balance: 117823,
    },
  ],
};

export const ManyTransactions = Template.bind({});
ManyTransactions.args = {
  ...Template.args,
  transactions: [
    ...SeveralTransactions.args.transactions,
    {
      id: 9,
      transactionId: 12,
      recordedDate: '2021-04-22',
      payee: 'Payday',
      type: 'income',
      memo: '',
      cleared: true,
      amount: 63408,
      balance: 54415,
    },
    {
      id: 8,
      transactionId: 12,
      recordedDate: '2021-04-20',
      payee: 'Movies',
      type: 'expense',
      memo: '',
      cleared: true,
      amount: -1466,
      balance: 55881,
    },
    {
      id: 7,
      transactionId: 12,
      recordedDate: '2021-04-20',
      payee: 'Restaurant with a really long name',
      type: 'expense',
      memo: '',
      cleared: true,
      amount: -2786,
      balance: 58667,
    },
    {
      id: 6,
      transactionId: 12,
      recordedDate: '2021-04-14',
      payee: 'Utilities',
      type: 'expense',
      memo: '',
      cleared: true,
      amount: -9872,
      balance: 68539,
    },
    {
      id: 5,
      transactionId: 12,
      recordedDate: '2021-04-13',
      payee: 'Pay credit card',
      type: 'transfer',
      memo: '',
      cleared: true,
      amount: -14730,
      balance: 83269,
    },
    {
      id: 4,
      transactionId: 12,
      recordedDate: '2021-04-12',
      payee: 'Dept. store',
      type: 'expense',
      memo: 'new shoes',
      cleared: true,
      amount: -4351,
      balance: 87620,
    },
    {
      id: 3,
      transactionId: 12,
      recordedDate: '2021-04-11',
      payee: 'Online order',
      type: 'expense',
      memo: 'Pantry items, new socks, craft supplies, pet food, and candy',
      cleared: true,
      amount: -26174,
      balance: 113794,
    },
    {
      id: 2,
      transactionId: 12,
      recordedDate: '2021-04-07',
      payee: 'Payday',
      type: 'income',
      memo: '',
      cleared: true,
      amount: 63409,
      balance: 50385,
    },
    {
      id: 1,
      transactionId: 12,
      recordedDate: '2021-04-05',
      payee: 'Phone bill',
      type: 'expense',
      memo: '',
      cleared: true,
      amount: -4997,
      balance: 55382,
    },
  ],
};

export const HasCleared = Template.bind({});
HasCleared.args = {
  ...ManyTransactions.args,
  hasCleared: true,
};
