import { action } from '@storybook/addon-actions';
import moment from 'moment';
import React from 'react';
import { MemoryRouter } from 'react-router';

import { ConfirmationServiceProvider } from '../../common/ConfirmationService';
import { SnackbarServiceProvider } from '../../common/SnackbarService';
import { LedgersContextProvider } from '../LedgersContext';
import LedgersTable from './LedgersTable';

const handleSelect = action('select');

export default {
  title: 'ledgers/LedgersTable',
  component: LedgersTable,
  decorators: [
    (story) => <LedgersContextProvider>{story()}</LedgersContextProvider>,
    (story) => <ConfirmationServiceProvider>{story()}</ConfirmationServiceProvider>,
    (story) => <SnackbarServiceProvider>{story()}</SnackbarServiceProvider>,
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
  ],
};

export const NoLedgers = () => <LedgersTable ledgers={[]} onSelect={handleSelect} />;

export const OneLedger = () => (
  <LedgersTable
    ledgers={[
      {
        id: 'ledgerId1',
        name: 'Demo Ledger',
        currency: 860,
        created: moment().subtract(6, 'day').toISOString(),
        lastUpdated: moment().subtract(5, 'hour').toISOString(),
      },
    ]}
    onSelect={handleSelect}
  />
);

export const SeveralLedgers = () => (
  <LedgersTable
    ledgers={[
      {
        id: 'ledgerId1',
        name: 'Demo Ledger',
        currency: 840,
        created: moment().subtract(86, 'day').toISOString(),
        lastUpdated: moment().subtract(75, 'day').toISOString(),
      },
      {
        id: 'ledgerId2',
        name: 'Foreign Ledger',
        currency: 980,
        created: moment().subtract(6, 'day').toISOString(),
        lastUpdated: moment().subtract(5, 'hour').toISOString(),
      },
      {
        id: 'ledgerId3',
        name: 'My Ledger',
        currency: 840,
        created: moment().subtract(36, 'day').toISOString(),
        lastUpdated: moment().subtract(25, 'day').toISOString(),
      },
    ]}
    onSelect={handleSelect}
  />
);

export const Mobile = () => (
  <LedgersTable
    ledgers={[
      {
        id: 'ledgerId1',
        name: 'Demo Ledger',
        currency: 840,
        created: moment().subtract(86, 'day').toISOString(),
        lastUpdated: moment().subtract(75, 'day').toISOString(),
      },
      {
        id: 'ledgerId2',
        name: 'Foreign Ledger',
        currency: 980,
        created: moment().subtract(6, 'day').toISOString(),
        lastUpdated: moment().subtract(5, 'hour').toISOString(),
      },
      {
        id: 'ledgerId3',
        name: 'My Ledger',
        currency: 840,
        created: moment().subtract(36, 'day').toISOString(),
        lastUpdated: moment().subtract(25, 'day').toISOString(),
      },
    ]}
    mobile
    onSelect={handleSelect}
  />
);
