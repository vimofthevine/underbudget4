import { action } from '@storybook/addon-actions';
import React from 'react';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import { transactionGenerator } from 'test/data-generators';
import SelectableTransactionsTable from '../SelectableTransactionsTable';

export default {
  title: 'transactions/SelectableTransactionsTable',
  component: SelectableTransactionsTable,
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
  <SelectableTransactionsTable
    loading={false}
    onSelect={action('select')}
    onSelectAll={action('select-all')}
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

export const SomeSelected = Template.bind({});
SomeSelected.args = {
  selected: [3, 1],
  transactions: [
    transactionGenerator({ id: 1 }),
    transactionGenerator({ id: 2 }),
    transactionGenerator({ id: 3 }),
    transactionGenerator({ id: 4 }),
  ],
};

export const AllSelected = Template.bind({});
AllSelected.args = {
  ...SomeSelected.args,
  selected: [3, 1, 2, 5, 4],
};
