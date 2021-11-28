import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AppProviders from 'common/components/AppProviders';
import setSelectedLedger from 'common/utils/setSelectedLedger';
import { transactionGenerator } from 'test/data-generators';
import CreateReconciliationPage from '../CreateReconciliationPage';

const trns = [...Array(30)].map((_, i) => transactionGenerator({ id: i + 1 }));

export default {
  title: 'reconciliations/CreateReconciliationPage',
  component: CreateReconciliationPage,
  decorators: [
    (story) => (
      <Routes>
        <Route path='/account/:id/create-reconciliation/*' element={story()} />
      </Routes>
    ),
    (story) => <AppProviders>{story()}</AppProviders>,
    (story) => {
      setSelectedLedger('2');
      return story();
    },
  ],
  parameters: {
    api: {
      get: [
        ['/api/ledgers/2', { currency: 840 }],
        [
          '/api/accounts/8/reconciliations/last',
          {
            beginningBalance: 100000,
            beginningDate: '2021-07-01',
            endingBalance: 200000,
            endingDate: '2021-07-31',
          },
        ],
        [
          /\/api\/account-transactions\/search?.*08-31.*/,
          {
            transactions: [trns[0], trns[1], trns[2], trns[4]],
          },
        ],
        [
          /\/api\/account-transactions\/search?.*/,
          {
            transactions: trns.slice(0, 2),
          },
        ],
        [
          /\/api\/accounts\/8\/unreconciled-transactions.*page=0.*/,
          {
            total: 30,
            transactions: trns.slice(0, 24),
          },
        ],
        [
          /\/api\/accounts\/8\/unreconciled-transactions.*page=1.*/,
          {
            total: 30,
            transactions: trns.slice(25, 29),
          },
        ],
      ],
      post: [['/api/accounts/8/reconciliations']],
    },
    initialRoute: '/account/8/create-reconciliation',
  },
};

const Template = () => <CreateReconciliationPage />;

export const Desktop = Template.bind({});

export const Mobile = Template.bind({});
Mobile.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};
