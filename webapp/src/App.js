import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useMemo } from 'react';
import { ReactQueryConfigProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ConfirmationServiceProvider } from './components/common/ConfirmationService';
import ProtectedRoute from './components/common/ProtectedRoute';
import { SnackbarServiceProvider } from './components/common/SnackbarService';
import LoginPage from './components/login/LoginPage';
import LogoutPage from './components/logout/LogoutPage';
import TokensPage from './components/tokens/TokensPage';
import createTheme from './utils/createTheme';
import queryConfig from './utils/queryConfig';
import * as routes from './utils/routes';

function App() {
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => createTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReactQueryConfigProvider config={queryConfig}>
        <BrowserRouter>
          <ConfirmationServiceProvider>
            <SnackbarServiceProvider>
              <Routes>
                <Route path={routes.LOGIN} element={<LoginPage />} />
                <Route path={routes.LOGOUT} element={<LogoutPage />} />
                <ProtectedRoute path={`${routes.TOKENS}/*`} element={<TokensPage />} />
                <ProtectedRoute path='*' element={<div>hi</div>} />
              </Routes>
            </SnackbarServiceProvider>
          </ConfirmationServiceProvider>
        </BrowserRouter>
      </ReactQueryConfigProvider>
    </ThemeProvider>
  );
}

export default App;
