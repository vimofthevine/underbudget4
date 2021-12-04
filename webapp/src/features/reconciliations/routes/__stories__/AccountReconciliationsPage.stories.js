import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import AppProviders from 'common/components/AppProviders';
import setSelectedLedger from 'common/utils/setSelectedLedger';
import { reconciliationsGenerator } from 'test/data-generators';
import AccountReconciliationsPage from '../AccountReconciliationsPage';

const GoBack = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: 'no-from-in-state' };
  return (
    <button type='button' onClick={() => navigate(from)}>
      go back
    </button>
  );
};

export default {
  title: 'reconciliations/AccountReconciliationsPage',
  component: AccountReconciliationsPage,
  decorators: [
    (story) => (
      <Routes>
        <Route path='/account/:id/reconciliations/*' element={story()} />
        <Route path='*' element={<GoBack />} />
      </Routes>
    ),
    (story) => <AppProviders>{story()}</AppProviders>,
    (story) => {
      setSelectedLedger('2');
      return story();
    },
  ],
  parameters: {
    initialRoute: '/account/8/reconciliations',
  },
};

const setupApi = (total) => {
  const reconciliations = reconciliationsGenerator(total);
  return {
    get: [
      ['/api/ledgers/2', { currency: 840 }],
      ['/api/accounts/8', { name: 'Account Name' }],
      [
        /\/api\/accounts\/8\/reconciliations.*/,
        (conf) => {
          const pageMatch = conf.url.match(/page=\d+/);
          const page = parseInt(pageMatch[1], 10);
          const sizeMatch = conf.url.match(/size=\d+/);
          const size = parseInt(sizeMatch[1], 10);
          return {
            reconciliations: reconciliations.slice((page - 1) * size, page * size),
            page,
            size,
            total,
          };
        },
      ],
    ],
  };
};

const Template = () => <AccountReconciliationsPage />;

export const NoReconciliations = Template.bind({});
NoReconciliations.parameters = {
  api: setupApi(0),
};

export const SeveralReconciliations = Template.bind({});
SeveralReconciliations.parameters = {
  api: setupApi(5),
};

export const ManyReconciliations = Template.bind({});
ManyReconciliations.parameters = {
  api: setupApi(60),
};
