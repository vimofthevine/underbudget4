/* eslint-disable react/prop-types */
import { action } from '@storybook/addon-actions';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { SnackbarServiceProvider } from '../../common/SnackbarService';
import { LedgersContextProvider, useLedgersDispatch } from '../LedgersContext';
import ModifyLedgerDialog from './ModifyLedgerDialog';

const OpenButton = () => {
  const dispatch = useLedgersDispatch();
  const handleClick = () =>
    dispatch({
      type: 'showModifyLedger',
      payload: {
        id: 'ledger-id',
        name: 'My Ledger',
        currency: 980,
      },
    });
  return (
    <button onClick={handleClick} type='button'>
      Open{' '}
    </button>
  );
};

export default {
  title: 'ledgers/ModifyLedgerDialog',
  component: ModifyLedgerDialog,
  decorators: [
    (story) => story({ mock: new MockAdapter(axios) }),
    (story) => (
      <>
        <OpenButton />
        {story()}
      </>
    ),
    (story) => <LedgersContextProvider>{story()}</LedgersContextProvider>,
    (story) => <SnackbarServiceProvider>{story()}</SnackbarServiceProvider>,
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
  ],
};

export const Success = ({ mock }) => {
  mock.onPut('/api/ledgers/ledger-id').reply((req) => {
    action('request')(req);
    return [200];
  });
  return <ModifyLedgerDialog />;
};

export const Failure = ({ mock }) => {
  mock.onPut('api/ledgers/ledger-id').reply(404);
  return <ModifyLedgerDialog />;
};

export const Mobile = () => <ModifyLedgerDialog />;
Mobile.story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
