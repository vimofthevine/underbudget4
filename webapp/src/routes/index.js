import { Route, Routes } from 'react-router-dom';
import React from 'react';

import * as routes from 'common/utils/routes';
import { AccountsListPage, AccountTransactionsPage } from 'features/accounts';
import { BudgetsPage, BudgetRoutes } from 'features/budgets';
import { EnvelopesListPage, EnvelopeTransactionsPage } from 'features/envelopes';
import { LedgersPage } from 'features/ledgers';

export const AppRoutes = () => (
  <Routes>
    <Route path={`${routes.ACCOUNTS}/*`} element={<AccountsListPage />} />
    <Route path={`${routes.ACCOUNT}/:id/*`} element={<AccountTransactionsPage />} />
    <Route path={`${routes.BUDGETS}/*`} element={<BudgetsPage />} />
    <Route path={`${routes.BUDGET}/*`} element={<BudgetRoutes />} />
    <Route path={`${routes.ENVELOPES}/*`} element={<EnvelopesListPage />} />
    <Route path={`${routes.ENVELOPE}/:id/*`} element={<EnvelopeTransactionsPage />} />
    <Route path={`${routes.LEDGERS}/*`} element={<LedgersPage />} />
    <Route path='*' element={<div>hi</div>} />
  </Routes>
);
