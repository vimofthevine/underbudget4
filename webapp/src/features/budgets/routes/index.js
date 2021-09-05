import { Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';

import BudgetExpensesPage from './BudgetExpensesPage';
import BudgetIncomesPage from './BudgetIncomesPage';
import BudgetPage from './BudgetPage';

export { default as BudgetsPage } from './BudgetsPage';

export const BudgetRoutes = () => (
  <Routes>
    <Route path=':id/expenses/*' element={<BudgetExpensesPage />} />
    <Route path=':id/incomes/*' element={<BudgetIncomesPage />} />
    <Route path=':id/*' element={<BudgetPage />} />
    <Route path='*' element={<Navigate to='.' />} />
  </Routes>
);
