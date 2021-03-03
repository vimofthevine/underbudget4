import { action } from '@storybook/addon-actions';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import AppProviders from '../../../common/components/AppProviders';
import { LedgersContextProvider } from '../LedgersContext';
import CreateDemoLedgerDialog from './CreateDemoLedgerDialog';

export default {
  title: 'ledgers/CreateDemoLedgerDialog',
  component: CreateDemoLedgerDialog,
  decorators: [
    (story) => story({ mock: new MockAdapter(axios) }),
    (story) => (
      <LedgersContextProvider initialState={{ showCreateDemoLedger: true }}>
        {story()}
      </LedgersContextProvider>
    ),
    (story) => <AppProviders>{story()}</AppProviders>,
  ],
};

export const Success = (_, { mock }) => {
  mock.onPost('/api/demos').reply((req) => {
    action('request')(req);
    return [201];
  });
  return <CreateDemoLedgerDialog />;
};

export const Failure = (_, { mock }) => {
  mock.onPost('/api/demos').reply(400);
  return <CreateDemoLedgerDialog />;
};

export const Mobile = Success.bind({});
Mobile.story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
