/* eslint-disable react/prop-types */
import { action } from '@storybook/addon-actions';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import AppProviders from '../../../common/components/AppProviders';
import { LedgersContextProvider, useLedgersState } from '../LedgersContext';
import LedgerActions from './LedgerActions';

const EditingLedger = () => {
  const state = useLedgersState();
  return state.ledgerToModify ? <div>{JSON.stringify(state.ledgerToModify)}</div> : null;
};

export default {
  title: 'ledgers/LedgerActions',
  component: LedgerActions,
  decorators: [
    (story) => story({ mock: new MockAdapter(axios) }),
    (story) => (
      <>
        {story()}
        <br />
        <EditingLedger />
      </>
    ),
    (story) => <LedgersContextProvider>{story()}</LedgersContextProvider>,
    (story) => <AppProviders>{story()}</AppProviders>,
  ],
};

export const DeleteSuccess = (_, { mock }) => {
  mock.onDelete('/api/ledgers/ledger-id').reply((req) => {
    action('request')(req);
    return [204];
  });
  return <LedgerActions ledger={{ id: 'ledger-id', name: 'My Ledger' }} />;
};

export const DeleteFailure = (_, { mock }) => {
  mock.onDelete('/api/ledgers/ledger-id').reply(403);
  return <LedgerActions ledger={{ id: 'ledger-id', name: 'My Ledger' }} />;
};

export const Mobile = () => <LedgerActions ledger={{ id: 'ledger-id', name: 'My Ledger' }} />;
Mobile.story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
