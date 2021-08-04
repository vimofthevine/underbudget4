import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AppProviders from 'common/components/AppProviders';
import setSelectedLedger from 'common/utils/setSelectedLedger';
import * as IncomeSummaryStories from 'budgets/components/IncomeSummary/IncomeSummary.stories';
import BudgetPage from './BudgetPage';

export default {
  title: 'budgets/BudgetPage',
  component: BudgetPage,
  decorators: [
    (story) => (
      <Routes>
        <Route path='/budget/:id' element={story()} />
      </Routes>
    ),
    (story) => <AppProviders>{story()}</AppProviders>,
    (story) => {
      setSelectedLedger('2');
      return story();
    },
  ],
  parameters: {
    initialRoute: '/budget/5',
  },
};

const Template = () => <BudgetPage />;

export const NoExpenses = Template.bind({});
NoExpenses.parameters = {
  api: {
    get: [
      ...IncomeSummaryStories.SeveralIncomes.parameters.api.get,
      ['/api/budgets/5', { name: 'My Budget', periods: 12 }],
    ],
  },
};
