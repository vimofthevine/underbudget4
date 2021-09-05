import React from 'react';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import IncomeSummary from '../IncomeSummary';

export default {
  title: 'budgets/IncomeSummary',
  component: IncomeSummary,
  decorators: [
    (story) => {
      setSelectedLedger('2');
      return story();
    },
  ],
  parameters: {
    api: {
      get: [['/api/ledgers/2', { currency: 840 }]],
    },
  },
};

const Template = (args) => <IncomeSummary budgetId={5} {...args} />;

export const FetchError = Template.bind({});

export const NoIncomes = Template.bind({});
NoIncomes.parameters = {
  api: {
    get: [
      ['/api/ledgers/2', { currency: 840 }],
      ['/api/budgets/5/periodic-incomes', { incomes: [] }],
    ],
  },
};

export const OneIncome = Template.bind({});
OneIncome.parameters = {
  api: {
    get: [
      ['/api/ledgers/2', { currency: 840 }],
      [
        '/api/budgets/5/periodic-incomes',
        {
          incomes: [{ id: 2, name: 'My Income', amount: 17755 }],
        },
      ],
    ],
  },
};

export const SeveralIncomes = Template.bind({});
SeveralIncomes.parameters = {
  api: {
    get: [
      ['/api/ledgers/2', { currency: 840 }],
      [
        '/api/budgets/5/periodic-incomes',
        {
          incomes: [
            { id: 2, name: 'My Income', amount: 17755 },
            { id: 4, name: 'Their Income', amount: 13681 },
            { id: 6, name: 'Other Income', amount: 4800 },
          ],
        },
      ],
    ],
  },
};
