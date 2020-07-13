import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useMemo } from 'react';
import { ReactQueryConfigProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppProviders from './common/components/AppProviders';
import createTheme from './common/utils/createTheme';
import queryConfig from './common/utils/queryConfig';
import * as routes from './common/utils/routes';
import ProtectedRoute from './components/common/ProtectedRoute';
import LedgersPage from './components/ledgers/LedgersPage';
import LoginPage from './components/login/LoginPage';
import LogoutPage from './components/logout/LogoutPage';
import TokensPage from './components/tokens/TokensPage';

function App() {
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => createTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReactQueryConfigProvider config={queryConfig}>
        <BrowserRouter>
          <AppProviders>
            <Routes>
              <Route path={routes.LOGIN} element={<LoginPage />} />
              <Route path={routes.LOGOUT} element={<LogoutPage />} />
              <ProtectedRoute path={`${routes.LEDGERS}/*`} element={<LedgersPage />} />
              <ProtectedRoute path={`${routes.TOKENS}/*`} element={<TokensPage />} />
              <ProtectedRoute path='*' element={<div>hi</div>} />
            </Routes>
          </AppProviders>
        </BrowserRouter>
      </ReactQueryConfigProvider>
    </ThemeProvider>
  );
}

export default App;
