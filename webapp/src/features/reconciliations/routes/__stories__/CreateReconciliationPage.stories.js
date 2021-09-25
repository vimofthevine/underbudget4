import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AppProviders from 'common/components/AppProviders';
import setSelectedLedger from 'common/utils/setSelectedLedger';
import { transactionGenerator } from 'test/data-generators';
import CreateReconciliationPage from '../CreateReconciliationPage';

const trn1 = transactionGenerator({ id: 1 });
const trn2 = transactionGenerator({ id: 2 });
const trn3 = transactionGenerator({ id: 3 });
const trn4 = transactionGenerator({ id: 4 });
const trn5 = transactionGenerator({ id: 5 });
const trn6 = transactionGenerator({ id: 6 });

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
            transactions: [trn1, trn2, trn3, trn5],
          },
        ],
        [
          /\/api\/account-transactions\/search?.*/,
          {
            transactions: [trn1, trn2, trn3],
          },
        ],
        [
          /\/api\/accounts\/8\/unreconciled-transactions.*/,
          {
            transactions: [trn1, trn2, trn3, trn4, trn5, trn6],
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
