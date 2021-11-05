import { action } from '@storybook/addon-actions';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppProviders from 'common/components/AppProviders';
import ModifyLedgerDialog from '../ModifyLedgerDialog';

export default {
  title: 'ledgers/ModifyLedgerDialog',
  component: ModifyLedgerDialog,
  decorators: [
    (story) => {
      const mock = new MockAdapter(axios);
      mock.onGet('/api/ledgers/ledger-id').reply(200, {
        id: 'ledger-id',
        name: 'My Ledger',
        currency: 980,
        lastUpdated: '',
      });
      return story({ mock });
    },
    (story) => (
      <Routes>
        <Route
          path='/ledgers/*'
          element={
            <Routes>
              <Route path='modify/:id' element={story()} />
            </Routes>
          }
        />
      </Routes>
    ),
    (story) => <AppProviders>{story()}</AppProviders>,
  ],
  parameters: {
    initialRoute: '/ledgers/modify/ledger-id',
  },
};

export const Success = (_, { mock }) => {
  mock.onPut('/api/ledgers/ledger-id').reply((req) => {
    action('request')(req);
    return [200];
  });
  return <ModifyLedgerDialog />;
};

export const Failure = (_, { mock }) => {
  mock.onPut('api/ledgers/ledger-id').reply(404);
  return <ModifyLedgerDialog />;
};

export const Mobile = () => <ModifyLedgerDialog />;
Mobile.story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
