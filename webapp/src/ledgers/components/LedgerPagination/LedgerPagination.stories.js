import React from 'react';

import LedgerPagination from './LedgerPagination';

export default {
  title: 'ledgers/LedgerPagination',
  component: LedgerPagination,
};

export const NoLedgers = () => <LedgerPagination count={0} />;

export const OnePageOfLedgers = () => <LedgerPagination count={3} />;

export const FewPagesOfLedgers = () => <LedgerPagination count={40} />;

export const ManyPagesOfLedgers = () => <LedgerPagination count={100} />;

export const SecondPage = ManyPagesOfLedgers.bind({});
SecondPage.parameters = { initialRoute: '?page=2' };

export const ThirdPage = ManyPagesOfLedgers.bind({});
ThirdPage.parameters = { initialRoute: '?page=3&size=20' };
