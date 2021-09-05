import { Route, Routes } from 'react-router-dom';
import React from 'react';

import AccountsListPage from 'accounts/components/AccountsListPage';
import AccountTransactionsPage from 'accounts/components/AccountTransactionsPage';
import * as routes from 'common/utils/routes';
import EnvelopesListPage from 'envelopes/components/EnvelopesListPage';
import EnvelopeTransactionsPage from 'envelopes/components/EnvelopeTransactionsPage';
import LedgerPages from 'ledgers/components/LedgerPages';
import { BudgetsPage, BudgetRoutes } from 'features/budgets';

export const AppRoutes = () => (
  <Routes>
    <Route path={`${routes.ACCOUNTS}/*`} element={<AccountsListPage />} />
    <Route path={`${routes.ACCOUNT}/:id/*`} element={<AccountTransactionsPage />} />
    <Route path={`${routes.BUDGETS}/*`} element={<BudgetsPage />} />
    <Route path={`${routes.BUDGET}/*`} element={<BudgetRoutes />} />
    <Route path={`${routes.ENVELOPES}/*`} element={<EnvelopesListPage />} />
    <Route path={`${routes.ENVELOPE}/:id/*`} element={<EnvelopeTransactionsPage />} />
    <Route path={`${routes.LEDGERS}/*`} element={<LedgerPages />} />
    <Route path='*' element={<div>hi</div>} />
  </Routes>
);
