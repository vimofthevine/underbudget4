import React from 'react';
import { Route, Routes } from 'react-router-dom';

import TransactionDetailsDialog from '../TransactionDetailsDialog';
import * as stories from './TransactionDetailsList.stories';

export default {
  title: 'transactions/TransactionDetailsDialog',
  component: TransactionDetailsDialog,
  decorators: stories.default.decorators,
  parameters: {
    initialRoute: '/transaction/7',
    viewport: { defaultViewport: 'mobile1' },
  },
};

const Template = () => (
  <Routes>
    <Route path='/transaction/:transactionId/*' element={<TransactionDetailsDialog />} />
  </Routes>
);

export const GetError = Template.bind({});
GetError.parameters = stories.GetError.parameters;

export const SimpleTransaction = Template.bind({});
SimpleTransaction.parameters = stories.SimpleTransaction.parameters;
