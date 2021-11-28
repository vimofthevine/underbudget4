import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AppProviders from 'common/components/AppProviders';
import setSelectedLedger from 'common/utils/setSelectedLedger';
import { transactionGenerator } from 'test/data-generators';
import CreateReconciliationPage from '../CreateReconciliationPage';

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
    initialRoute: '/account/8/create-reconciliation',
  },
};

const setupApi = (total) => {
  const trns = [...Array(total)].map((_, i) => transactionGenerator({ id: i + 1 }));

  return {
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
          total,
          transactions: trns.slice(0, 24),
        },
      ],
      [
        /\/api\/accounts\/8\/unreconciled-transactions.*page=1.*/,
        {
          total,
          transactions: trns.slice(25, 29),
        },
      ],
    ],
    post: [['/api/accounts/8/reconciliations']],
  };
};

const Template = () => <CreateReconciliationPage />;

export const Desktop = Template.bind({});
Desktop.parameters = {
  api: setupApi(30),
};

export const Mobile = Template.bind({});
Mobile.parameters = {
  api: setupApi(30),
  viewport: { defaultViewport: 'mobile1' },
};

export const NoPagination = Template.bind({});
NoPagination.parameters = {
  api: setupApi(15),
};
