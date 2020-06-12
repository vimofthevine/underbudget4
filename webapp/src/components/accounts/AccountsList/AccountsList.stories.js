import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import AccountsList from './AccountsList';

export default {
  title: 'accounts/AccountsList',
  component: AccountsList,
  decorators: [(story) => <MemoryRouter>{story()}</MemoryRouter>],
};

export const NoAccounts = () => <AccountsList accountCategories={[]} />;

export const FewAccounts = () => (
  <AccountsList
    accountCategories={[
      {
        id: 'cat-id-1',
        name: 'Category 1',
        accounts: [],
      },
      {
        id: 'cat-id-2',
        name: 'Category 2',
        accounts: [
          {
            id: 'account-id-1',
            name: 'Account 1',
          },
          {
            id: 'account-id-2',
            name: 'Account 2',
          },
        ],
      },
    ]}
  />
);

const createAccount = (catId, acctId) => ({
  id: `account-id-${catId}-${acctId}`,
  name: `Account ${acctId}`,
});

const createCategory = (catId, numAccts) => ({
  id: `cat-id-${catId}`,
  name: `Category ${catId}`,
  accounts: [...Array(numAccts)].map((_, i) => createAccount(catId, i)),
});

export const ManyAccounts = () => (
  <AccountsList
    accountCategories={[
      createCategory(1, 3),
      createCategory(2, 8),
      createCategory(3, 5),
      createCategory(4, 16),
    ]}
  />
);
