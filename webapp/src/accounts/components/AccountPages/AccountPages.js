import React from 'react';

import { AccountContextProvider } from '../../contexts/account';
import AccountsListPage from '../AccountsListPage';

const AccountPages = () => (
  <AccountContextProvider>
    <AccountsListPage />
  </AccountContextProvider>
);

export default AccountPages;
