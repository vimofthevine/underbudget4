import React from 'react';

import { LedgersContextProvider } from '../LedgersContext';
import LedgerPagination from './LedgerPagination';

export default {
  title: 'ledgers/LedgerPagination',
  component: LedgerPagination,
  decorators: [(story) => <LedgersContextProvider>{story()}</LedgersContextProvider>],
};

export const NoLedgers = () => <LedgerPagination count={0} />;

export const OnePageOfLedgers = () => <LedgerPagination count={3} />;

export const ManyPagesOfLedgers = () => <LedgerPagination count={40} />;
