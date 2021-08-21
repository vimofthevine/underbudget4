import React from 'react';
import { Route, Routes } from 'react-router-dom';

import AppProviders from 'common/components/AppProviders';
import setSelectedLedger from 'common/utils/setSelectedLedger';
import * as ActiveBudgetsListStories from 'budgets/components/ActiveBudgetsList/ActiveBudgetsList.stories';
import * as AllBudgetsListStories from 'budgets/components/AllBudgetsList/AllBudgetsList.stories';
import BudgetsPage from './BudgetsPage';

export default {
  title: 'budgets/BudgetsPage',
  component: BudgetsPage,
  decorators: [
    (story) => (
      <Routes>
        <Route path='/budgets/*' element={story()} />
      </Routes>
    ),
    (story) => <AppProviders>{story()}</AppProviders>,
    (story) => {
      setSelectedLedger('2');
      return story();
    },
  ],
  parameters: {
    initialRoute: '/budgets',
  },
};

const Template = () => <BudgetsPage />;

export const FetchError = Template.bind({});

export const NoBudgets = Template.bind({});
NoBudgets.parameters = {
  api: {
    get: [
      ...ActiveBudgetsListStories.NoBudgets.parameters.api.get,
      ...AllBudgetsListStories.NoBudgets.parameters.api.get,
    ],
  },
};

export const SeveralBudgets = Template.bind({});
SeveralBudgets.parameters = {
  api: {
    get: [
      ...ActiveBudgetsListStories.SeveralBudgets.parameters.api.get,
      ...AllBudgetsListStories.SeveralBudgets.parameters.api.get,
    ],
  },
};

export const Mobile = Template.bind({});
Mobile.parameters = {
  api: SeveralBudgets.parameters.api,
  viewport: { defaultViewport: 'mobile1' },
};
