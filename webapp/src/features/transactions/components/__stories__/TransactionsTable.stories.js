import { action } from '@storybook/addon-actions';
import React from 'react';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import { transactionGenerator } from 'test/data-generators';
import TransactionsTable from '../TransactionsTable';

export default {
  title: 'transactions/TransactionsTable',
  component: TransactionsTable,
  decorators: [
    (story) => {
      setSelectedLedger(2);
      return story();
    },
  ],
  parameters: {
    api: {
      get: [['/api/ledgers/2', { currency: 840 }]],
    },
  },
};

const Template = (args) => (
  <TransactionsTable loading={false} onClick={action('click')} transactions={[]} {...args} />
);

export const Loading = Template.bind({});
Loading.args = { loading: true };

export const NoTransactions = Template.bind({});

export const OneTransaction = Template.bind({});
OneTransaction.args = {
  transactions: [transactionGenerator()],
};

export const SeveralTransactions = Template.bind({});
SeveralTransactions.args = {
  transactions: [...Array(5)].map(transactionGenerator),
};

export const NoClickAction = Template.bind({});
NoClickAction.args = {
  onClick: null,
  transactions: [...Array(5)].map(transactionGenerator),
};
