import green from '@material-ui/core/colors/green';
import indigo from '@material-ui/core/colors/indigo';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './components/login/LoginPage';
import LogoutPage from './components/logout/LogoutPage';
import * as routes from './utils/routes';

function App() {
  const darkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: {
            main: green[100],
          },
          secondary: {
            main: indigo[100],
          },
          type: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path={routes.LOGIN} element={<LoginPage />} />
          <Route path={routes.LOGOUT} element={<LogoutPage />} />
          <ProtectedRoute path='*' element={<div>hi</div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
