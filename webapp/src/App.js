import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AccountsListPage from './accounts/components/AccountsListPage';
import AccountTransactionsPage from './accounts/components/AccountTransactionsPage';
import AppProviders from './common/components/AppProviders';
import createTheme from './common/utils/createTheme';
import queryConfig from './common/utils/queryConfig';
import * as routes from './common/utils/routes';
import EnvelopePages from './envelopes/components/EnvelopePages';
import LedgerPages from './ledgers/components/LedgerPages';

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
              <Route path={`${routes.ENVELOPES}/*`} element={<EnvelopePages />} />
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
