import React from 'react';

import AppPage from '../../common/AppPage';
import { AccountsContextProvider } from '../AccountsContext';
import AccountsList from '../AccountsList';
import AccountsListToolbarButton from '../AccountsListToolbarButton';
import CreateAccountCategoryDialog from '../CreateAccountCategoryDialog';
import CreateAccountDialog from '../CreateAccountDialog';

const MobileAccountsListPage = () => (
  <AccountsContextProvider>
    <AppPage title='My Accounts' toolbarAction={<AccountsListToolbarButton />}>
      <AccountsList />
      <CreateAccountCategoryDialog />
      <CreateAccountDialog />
    </AppPage>
  </AccountsContextProvider>
);

export default MobileAccountsListPage;
