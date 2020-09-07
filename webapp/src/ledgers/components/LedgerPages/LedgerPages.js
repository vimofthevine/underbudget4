import React from 'react';

import { LedgersContextProvider } from '../LedgersContext';
import LedgersPage from '../LedgersPage';

const LedgerPages = () => (
  <LedgersContextProvider>
    <LedgersPage />
  </LedgersContextProvider>
);

export default LedgerPages;
