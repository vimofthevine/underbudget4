import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import setSelectedLedger from '../../../ledgers/utils/setSelectedLedger';
import TransactionDetailsTable from './TransactionDetailsTable';

export default {
  title: 'transactions/TransactionDetailsTable',
  component: TransactionDetailsTable,
  decorators: [
    (story, { parameters } = {}) => {
      const { transaction = {}, delayResponse = 1000, code = 200 } = parameters;

      setSelectedLedger('2');

      const mockAxios = new MockAdapter(axios, { delayResponse });

      mockAxios.onGet('/api/ledgers/2/account-categories').reply(code, {
        categories: [
          {
            id: 1,
            name: 'Banks',
            accounts: [{ id: 1, name: 'Checking' }],
          },
          {
            id: 2,
            name: 'Credit Cards',
            accounts: [{ id: 2, name: 'Visa' }],
          },
        ],
      });

      mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(code, {
        categories: [
          {
            id: 1,
            name: 'Food',
            envelopes: [{ id: 1, name: 'Dining' }],
          },
          {
            id: 2,
            name: 'Luxury',
            envelopes: [{ id: 2, name: 'Clothes' }],
          },
        ],
      });

      mockAxios.onGet('/api/transactions/7').reply(code, transaction);

      return story();
    },
  ],
};

const formatMoney = (v) =>
  new Intl.NumberFormat(undefined, { currency: 'USD', style: 'currency' }).format(v / 100);

const Template = (args) => <TransactionDetailsTable formatMoney={formatMoney} id={7} {...args} />;

export const GetError = Template.bind({});
GetError.parameters = {
  code: 404,
};

export const SimpleTransaction = Template.bind({});
SimpleTransaction.parameters = {
  transaction: {
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
  },
};

export const SplitTransaction = Template.bind({});
SplitTransaction.parameters = {
  transaction: {
    accountTransactions: [
      {
        id: 2,
        accountId: 2,
        memo: 'account memo',
        amount: -1450,
        cleared: true,
      },
    ],
    envelopeTransactions: [
      {
        id: 5,
        envelopeId: 2,
        memo: 'envelope memo 1',
        amount: -400,
      },
      {
        id: 6,
        envelopeId: 1,
        memo: 'envelope memo 2',
        amount: -1050,
      },
    ],
  },
};

export const AccountTransfer = Template.bind({});
AccountTransfer.parameters = {
  transaction: {
    accountTransactions: [
      {
        id: 2,
        accountId: 2,
        memo: '',
        amount: 3500,
      },
      {
        id: 3,
        accountId: 1,
        memo: '',
        amount: -3500,
      },
    ],
    envelopeTransactions: [],
  },
};

export const EnvelopeTransfer = Template.bind({});
EnvelopeTransfer.parameters = {
  transaction: {
    accountTransactions: [],
    envelopeTransactions: [
      {
        id: 5,
        envelopeId: 2,
        memo: '',
        amount: 2000,
      },
      {
        id: 6,
        envelopeId: 1,
        memo: '',
        amount: -2000,
      },
    ],
  },
};