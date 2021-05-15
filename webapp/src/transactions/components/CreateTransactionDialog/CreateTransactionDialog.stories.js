import React from 'react';

import AppProviders from 'common/components/AppProviders';
import CreateTransactionDialog from './CreateTransactionDialog';

export default {
  title: 'transactions/CreateTransactionDialog',
  component: CreateTransactionDialog,
  decorators: [(story) => <AppProviders>{story()}</AppProviders>],
};

export const Desktop = () => <CreateTransactionDialog />;

export const Mobile = Desktop.bind({});
Mobile.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};
