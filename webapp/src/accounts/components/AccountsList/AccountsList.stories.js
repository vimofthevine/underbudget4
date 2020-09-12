import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { ReactQueryCacheProvider, ReactQueryConfigProvider, makeQueryCache } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import AppProviders from '../../../common/components/AppProviders';
import setSelectedLedger from '../../../ledgers/utils/setSelectedLedger';
import { AccountContextProvider } from '../../contexts/account';
import AccountsList from './AccountsList';

const queryCache = makeQueryCache();
const queryConfig = { retry: false };

export default {
  title: 'accounts/AccountsList',
  component: AccountsList,
  decorators: [
    (story) => story({ mock: new MockAdapter(axios, { delayResponse: 1000 }) }),
    (story) => <AccountContextProvider>{story()}</AccountContextProvider>,
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
    (story) => <AppProviders>{story()}</AppProviders>,
    (story) => <ReactQueryCacheProvider queryCache={queryCache}>{story()}</ReactQueryCacheProvider>,
    (story) => <ReactQueryConfigProvider config={queryConfig}>{story()}</ReactQueryConfigProvider>,
    (story) => {
      setSelectedLedger('ledger-id');
      return story();
    },
  ],
};

export const FetchError = (_, { mock }) => {
  mock.onGet('/api/ledgers/ledger-id/accountCategories?projection=categoryWithAccounts').reply(500);
  return <AccountsList />;
};

export const NoAccounts = (_, { mock }) => {
  mock
    .onGet('/api/ledgers/ledger-id/accountCategories?projection=categoryWithAccounts')
    .reply(200, {
      _embedded: { accountCategories: [] },
    });
  return <AccountsList />;
};

export const FewCategories = (_, { mock }) => {
  mock
    .onGet('/api/ledgers/ledger-id/accountCategories?projection=categoryWithAccounts')
    .reply(200, {
      _embedded: {
        accountCategories: [
          {
            id: 'cat-id-2',
            name: 'Category 2',
            accounts: [{ id: 'acct-id-3', name: 'Account 2.1' }],
          },
          {
            id: 'cat-id-3',
            name: 'Category 3',
            accounts: [{ id: 'acct-id-4', name: 'Account 3.1' }],
          },
          {
            id: 'cat-id-1',
            name: 'Category 1',
            accounts: [
              { id: 'acct-id-2', name: 'Account 1.2' },
              { id: 'acct-id-1', name: 'Account 1.1' },
            ],
          },
        ],
      },
    });
  return <AccountsList />;
};

const createAccount = (catId, acctId) => ({
  id: `account-id-${catId}-${acctId}`,
  name: `Account ${acctId}`,
});

const createCategory = (catId, numAccts) => ({
  id: `cat-id-${catId}`,
  name: `Category ${catId}`,
  accounts: [...Array(numAccts)].map((_, i) => createAccount(catId, i)),
});

export const ManyAccounts = (_, { mock }) => {
  mock
    .onGet('/api/ledgers/ledger-id/accountCategories?projection=categoryWithAccounts')
    .reply(200, {
      _embedded: {
        accountCategories: [
          createCategory(1, 3),
          createCategory(2, 8),
          createCategory(3, 5),
          createCategory(4, 16),
        ],
      },
    });
  return <AccountsList />;
};
