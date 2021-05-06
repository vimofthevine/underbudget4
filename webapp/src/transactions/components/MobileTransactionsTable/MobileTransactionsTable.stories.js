import React from 'react';

import * as fullStories from '../FullTransactionsTable/FullTransactionsTable.stories';
import MobileTransactionsTable from './MobileTransactionsTable';

export default {
  title: 'transactions/MobileTransactionsTable',
  component: MobileTransactionsTable,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

const Template = (args) => <MobileTransactionsTable {...args} />;

export const NoTransactions = Template.bind({});

export const OneTransaction = Template.bind({});
OneTransaction.args = fullStories.OneTransaction.args;

export const SeveralTransactions = Template.bind({});
SeveralTransactions.args = fullStories.SeveralTransactions.args;

export const ManyTransactions = Template.bind({});
ManyTransactions.args = fullStories.ManyTransactions.args;

export const HasCleared = Template.bind({});
HasCleared.args = fullStories.HasCleared.args;
