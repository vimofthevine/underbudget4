import { action } from '@storybook/addon-actions';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import AppProviders from 'common/components/AppProviders';
import CreateLedgerDialog from '../CreateLedgerDialog';

export default {
  title: 'ledgers/CreateLedgerDialog',
  component: CreateLedgerDialog,
  decorators: [
    (story) => story({ mock: new MockAdapter(axios) }),
    (story) => <AppProviders>{story()}</AppProviders>,
  ],
};

export const Success = (_, { mock }) => {
  mock.onPost('/api/ledgers').reply((req) => {
    action('request')(req);
    return [201];
  });
  return <CreateLedgerDialog />;
};

export const Failure = (_, { mock }) => {
  mock.onPost('/api/ledgers').reply(400);
  return <CreateLedgerDialog />;
};

export const Mobile = () => <CreateLedgerDialog />;
Mobile.story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
