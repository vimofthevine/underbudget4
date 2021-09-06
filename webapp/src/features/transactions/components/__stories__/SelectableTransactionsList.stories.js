import { action } from '@storybook/addon-actions';
import React from 'react';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import { transactionGenerator } from 'test/data-generators';
import SelectableTransactionsList from '../SelectableTransactionsList';

export default {
  title: 'transactions/SelectableTransactionsList',
  component: SelectableTransactionsList,
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
    viewport: { defaultViewport: 'mobile1' },
  },
};

const Template = (args) => (
  <SelectableTransactionsList
    loading={false}
    onSelect={action('select')}
    selected={[]}
    transactions={[]}
    {...args}
  />
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

export const WithSelection = Template.bind({});
WithSelection.args = {
  selected: [3, 1],
  transactions: [
    transactionGenerator({ id: 1 }),
    transactionGenerator({ id: 2 }),
    transactionGenerator({ id: 3 }),
    transactionGenerator({ id: 4 }),
  ],
};
