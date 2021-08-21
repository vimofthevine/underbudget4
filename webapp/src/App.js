import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AccountsListPage from 'accounts/components/AccountsListPage';
import AccountTransactionsPage from 'accounts/components/AccountTransactionsPage';
import AppProviders from 'common/components/AppProviders';
import createTheme from 'common/utils/createTheme';
import queryConfig from 'common/utils/queryConfig';
import * as routes from 'common/utils/routes';
import EnvelopesListPage from 'envelopes/components/EnvelopesListPage';
import EnvelopeTransactionsPage from 'envelopes/components/EnvelopeTransactionsPage';
import LedgerPages from 'ledgers/components/LedgerPages';
import BudgetExpensesPage from 'pages/components/BudgetExpensesPage';
import BudgetIncomesPage from 'pages/components/BudgetIncomesPage';
import BudgetPage from 'pages/components/BudgetPage';
import BudgetsPage from 'pages/components/BudgetsPage';

const queryClient = new QueryClient({ defaultOptions: queryConfig });

function App() {
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => createTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppProviders>
            <Routes>
              <Route path={`${routes.ACCOUNTS}/*`} element={<AccountsListPage />} />
              <Route path={`${routes.ACCOUNT}/:id/*`} element={<AccountTransactionsPage />} />
              <Route path={`${routes.BUDGETS}/*`} element={<BudgetsPage />} />
              <Route path={`${routes.BUDGET}/:id/expenses/*`} element={<BudgetExpensesPage />} />
              <Route path={`${routes.BUDGET}/:id/incomes/*`} element={<BudgetIncomesPage />} />
              <Route path={`${routes.BUDGET}/:id/*`} element={<BudgetPage />} />
              <Route path={`${routes.ENVELOPES}/*`} element={<EnvelopesListPage />} />
              <Route path={`${routes.ENVELOPE}/:id/*`} element={<EnvelopeTransactionsPage />} />
              <Route path={`${routes.LEDGERS}/*`} element={<LedgerPages />} />
              <Route path='*' element={<div>hi</div>} />
            </Routes>
          </AppProviders>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
