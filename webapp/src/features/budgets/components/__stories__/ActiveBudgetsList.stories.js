import React from 'react';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import ActiveBudgetsList from '../ActiveBudgetsList';

export default {
  title: 'budgets/ActiveBudgetsList',
  component: ActiveBudgetsList,
  decorators: [
    (story) => {
      setSelectedLedger(2);
      return story();
    },
  ],
};

const Template = () => <ActiveBudgetsList />;

export const FetchError = Template.bind({});

export const NoBudgets = Template.bind({});
NoBudgets.parameters = {
  api: {
    get: [['/api/ledgers/2/active-budgets', { activeBudgets: [] }]],
  },
};

export const OneBudget = Template.bind({});
OneBudget.parameters = {
  api: {
    get: [
      [
        '/api/ledgers/2/active-budgets',
        {
          activeBudgets: [{ id: 7, name: 'My Budget', year: 2021 }],
        },
      ],
    ],
  },
};

export const SeveralBudgets = Template.bind({});
SeveralBudgets.parameters = {
  api: {
    get: [
      [
        '/api/ledgers/2/active-budgets',
        {
          activeBudgets: [
            { id: 7, name: 'My Budget', year: 2020 },
            { id: 7, name: 'My Budget', year: 2021 },
            { id: 3, name: 'Old Budget', year: 2019 },
          ],
        },
      ],
    ],
  },
};
