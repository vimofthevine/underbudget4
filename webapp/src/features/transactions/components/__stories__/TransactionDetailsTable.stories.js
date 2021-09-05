import React from 'react';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import setupMockApi from 'tests/setupMockApi';
import TransactionDetailsTable from '../TransactionDetailsTable';

export default {
  title: 'transactions/TransactionDetailsTable',
  component: TransactionDetailsTable,
  decorators: [
    (story, { parameters } = {}) => {
      const { transaction = {}, code = 200 } = parameters;

      setSelectedLedger('2');

      const mockAxios = setupMockApi(parameters);
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
    recordedDate: '2021-05-07',
    type: 'income',
    payee: 'Vendor',
    accountTransactions: [
      {
        id: 2,
        accountId: 2,
        memo: '',
        amount: 1450,
      },
    ],
    envelopeTransactions: [
      {
        id: 5,
        envelopeId: 2,
        memo: '',
        amount: 1450,
      },
    ],
  },
};

export const SplitTransaction = Template.bind({});
SplitTransaction.parameters = {
  transaction: {
    recordedDate: '2021-05-07',
    type: 'expense',
    payee: 'Vendor',
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
    recordedDate: '2021-05-07',
    type: 'transfer',
    payee: 'Transfer',
    accountTransactions: [
      {
        id: 2,
        accountId: 2,
        memo: '',
        cleared: false,
        amount: 3500,
      },
      {
        id: 3,
        accountId: 1,
        memo: '',
        cleared: true,
        amount: -3500,
      },
    ],
    envelopeTransactions: [],
  },
};

export const EnvelopeTransfer = Template.bind({});
EnvelopeTransfer.parameters = {
  transaction: {
    recordedDate: '2021-05-07',
    type: 'allocation',
    payee: 'Budget',
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
