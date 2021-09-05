import React from 'react';

import AppProviders from 'common/components/AppProviders';
import setSelectedLedger from 'common/utils/setSelectedLedger';
import setupMockApi from 'tests/setupMockApi';
import CreateTransactionDialog from '../CreateTransactionDialog';

export default {
  title: 'transactions/CreateTransactionDialog',
  component: CreateTransactionDialog,
  decorators: [
    (story) => <AppProviders>{story()}</AppProviders>,
    (story, { parameters }) => {
      setSelectedLedger('2');
      setupMockApi(parameters);
      return story();
    },
  ],
};

export const Desktop = () => <CreateTransactionDialog />;

export const Mobile = Desktop.bind({});
Mobile.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};
