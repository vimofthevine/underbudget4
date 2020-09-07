import React from 'react';

import CreateAccountCategoryDialog from '../../../accounts/components/CreateAccountCategoryDialog';
import AppPage from '../../../common/components/FullAppPage';
import { AccountsContextProvider } from '../AccountsContext';
import AccountsList from '../AccountsList';
import AccountsListToolbarButton from '../AccountsListToolbarButton';
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
