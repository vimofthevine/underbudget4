import React from 'react';

import TransactionDetailsList from '../TransactionDetailsList';
import * as stories from './TransactionDetailsTable.stories';

export default {
  title: 'transactions/TransactionDetailsList',
  component: TransactionDetailsList,
  decorators: stories.default.decorators,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

const Template = (args) => <TransactionDetailsList id={7} {...args} />;

export const GetError = Template.bind({});
GetError.parameters = stories.GetError.parameters;

export const SimpleTransaction = Template.bind({});
SimpleTransaction.parameters = stories.SimpleTransaction.parameters;

export const SplitTransaction = Template.bind({});
SplitTransaction.parameters = stories.SplitTransaction.parameters;

export const AccountTransfer = Template.bind({});
AccountTransfer.parameters = stories.AccountTransfer.parameters;

export const EnvelopeTransfer = Template.bind({});
EnvelopeTransfer.parameters = stories.EnvelopeTransfer.parameters;
