import { Route, Routes } from 'react-router-dom';
import React from 'react';

import * as routes from 'common/utils/routes';
import { AccountsListPage, AccountTransactionsPage } from 'features/accounts';
import { BudgetsPage, BudgetRoutes } from 'features/budgets';
import { EnvelopesListPage, EnvelopeTransactionsPage } from 'features/envelopes';
import { LedgersPage } from 'features/ledgers';
import {
  AccountReconciliationsPage,
  CreateReconciliationPage,
  ReconciliationPage,
} from 'features/reconciliations';

export const AppRoutes = () => (
  <Routes>
    <Route path={routes.accountsRoute('*')} element={<AccountsListPage />} />
    <Route
      path={routes.accountReconciliationsRoute(':id')}
      element={<AccountReconciliationsPage />}
    />
    <Route path={routes.createReconciliationRoute(':id')} element={<CreateReconciliationPage />} />
    <Route path={routes.accountRoute(':id/*')} element={<AccountTransactionsPage />} />
    <Route path={routes.reconciliationRoute(':id/*')} element={<ReconciliationPage />} />
    <Route path={`${routes.BUDGETS}/*`} element={<BudgetsPage />} />
    <Route path={`${routes.BUDGET}/*`} element={<BudgetRoutes />} />
    <Route path={`${routes.ENVELOPES}/*`} element={<EnvelopesListPage />} />
    <Route path={`${routes.ENVELOPE}/:id/*`} element={<EnvelopeTransactionsPage />} />
    <Route path={`${routes.LEDGERS}/*`} element={<LedgersPage />} />
    <Route path='*' element={<div>hi</div>} />
  </Routes>
);
