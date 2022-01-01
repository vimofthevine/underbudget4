import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AppProviders from 'common/components/AppProviders';
import setSelectedLedger from 'common/utils/setSelectedLedger';
import {
  accountGenerator,
  reconciliationGenerator,
  transactionsGenerator,
} from 'test/data-generators';
import ReconciliationPage from '../ReconciliationPage';

export default {
  title: 'reconciliations/ReconciliationPage',
  component: ReconciliationPage,
  decorators: [
    (story) => (
      <Routes>
        <Route path='/reconciliation/:id/*' element={story()} />
      </Routes>
    ),
    (story) => <AppProviders>{story()}</AppProviders>,
    (story) => {
      setSelectedLedger('2');
      return story();
    },
  ],
  parameters: {
    initialRoute: '/reconciliation/13',
  },
};

const setupApi = (total) => ({
  get: [
    ['/api/ledgers/2', { currency: 840 }],
    ['/api/accounts/7', accountGenerator()],
    ['/api/reconciliations/13', reconciliationGenerator({ accountId: 7 })],
    [
      /\/api\/reconciliations\/13\/transactions.*/,
      {
        transactions: transactionsGenerator(total),
        total,
      },
    ],
  ],
});

const Template = () => <ReconciliationPage />;

export const NoReconciliation = Template.bind({});

export const NoTransactions = Template.bind({});
NoTransactions.parameters = {
  api: setupApi(0),
};

export const SeveralTransactions = Template.bind({});
SeveralTransactions.parameters = {
  api: setupApi(5),
};

export const ManyTransactions = Template.bind({});
ManyTransactions.parameters = {
  api: setupApi(26),
};
