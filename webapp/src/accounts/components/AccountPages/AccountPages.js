import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AccountsListPage from '../AccountsListPage';
import AccountTransactionsPage from '../AccountTransactionsPage';

const AccountPages = () => (
  <Routes>
    <Route path=':id(\d+)' element={<AccountTransactionsPage />} />
    <Route path='*' element={<AccountsListPage />} />
  </Routes>
);

export default AccountPages;
