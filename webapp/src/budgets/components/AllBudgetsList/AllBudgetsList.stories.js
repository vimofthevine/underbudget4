import React from 'react';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import AllBudgetsList from './AllBudgetsList';

export default {
  title: 'budgets/AllBudgetsList',
  component: AllBudgetsList,
  decorators: [
    (story) => {
      setSelectedLedger(2);
      return story();
    },
  ],
};

const Template = () => <AllBudgetsList />;

export const FetchError = Template.bind({});

export const NoBudgets = Template.bind({});
NoBudgets.parameters = {
  api: {
    get: [['/api/ledgers/2/budgets', { budgets: [] }]],
  },
};

export const OneBudget = Template.bind({});
OneBudget.parameters = {
  api: {
    get: [
      [
        '/api/ledgers/2/budgets',
        {
          budgets: [{ id: 7, name: 'My Budget', periods: 12 }],
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
        '/api/ledgers/2/budgets',
        {
          budgets: [
            { id: 7, name: 'My Budget', periods: 12 },
            { id: 3, name: 'Old Budget', periods: 12 },
            { id: 8, name: 'Copy of My Budget', periods: 12 },
            { id: 9, name: 'Theoretical Budget', periods: 24 },
          ],
        },
      ],
    ],
  },
};
