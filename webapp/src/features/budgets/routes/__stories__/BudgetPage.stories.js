import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AppProviders from 'common/components/AppProviders';
import setSelectedLedger from 'common/utils/setSelectedLedger';
import * as ExpenseSummaryStories from '../../components/__stories__/ExpenseSummary.stories';
import * as IncomeSummaryStories from '../../components/__stories__/IncomeSummary.stories';
import BudgetPage from '../BudgetPage';

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

export const NoEntries = Template.bind({});
NoEntries.parameters = {
  api: {
    get: [
      ...ExpenseSummaryStories.NoExpenses.parameters.api.get,
      ...IncomeSummaryStories.NoIncomes.parameters.api.get,
      ['/api/budgets/5', { name: 'My Budget', periods: 12 }],
    ],
  },
};

export const NoExpenses = Template.bind({});
NoExpenses.parameters = {
  api: {
    get: [
      ...ExpenseSummaryStories.NoExpenses.parameters.api.get,
      ...IncomeSummaryStories.SeveralIncomes.parameters.api.get,
      ['/api/budgets/5', { name: 'My Budget', periods: 12 }],
    ],
  },
};

export const NoIncomes = Template.bind({});
NoIncomes.parameters = {
  api: {
    get: [
      ...ExpenseSummaryStories.SeveralExpenses.parameters.api.get,
      ...IncomeSummaryStories.NoIncomes.parameters.api.get,
      ['/api/budgets/5', { name: 'My Budget', periods: 12 }],
    ],
  },
};

export const SeveralOfBoth = Template.bind({});
SeveralOfBoth.parameters = {
  api: {
    get: [
      ...ExpenseSummaryStories.SeveralExpenses.parameters.api.get,
      ...IncomeSummaryStories.SeveralIncomes.parameters.api.get,
      ['/api/budgets/5', { name: 'My Budget', periods: 12 }],
    ],
  },
};
