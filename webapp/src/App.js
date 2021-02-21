import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { useMemo } from 'react';
import { ReactQueryConfigProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AccountPages from './accounts/components/AccountPages';
import AppProviders from './common/components/AppProviders';
import createTheme from './common/utils/createTheme';
import queryConfig from './common/utils/queryConfig';
import * as routes from './common/utils/routes';
import EnvelopePages from './envelopes/components/EnvelopePages';
import LedgerPages from './ledgers/components/LedgerPages';

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
              <Route path={`${routes.ACCOUNTS}/*`} element={<AccountPages />} />
              <Route path={`${routes.ENVELOPES}/*`} element={<EnvelopePages />} />
              <Route path={`${routes.LEDGERS}/*`} element={<LedgerPages />} />
              <Route path='*' element={<div>hi</div>} />
            </Routes>
          </AppProviders>
        </BrowserRouter>
      </ReactQueryConfigProvider>
    </ThemeProvider>
  );
}

export default App;
