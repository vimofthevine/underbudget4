import React from 'react';

import AppProviders from 'common/components/AppProviders';
import setSelectedLedger from 'common/utils/setSelectedLedger';
import setupMockApi from 'tests/setupMockApi';
import CreateAnnualExpenseDialog from '../CreateAnnualExpenseDialog';

export default {
  title: 'budgets/CreateAnnualExpenseDialog',
  component: CreateAnnualExpenseDialog,
  decorators: [
    (story) => <AppProviders>{story()}</AppProviders>,
    (story, { parameters }) => {
      setSelectedLedger('2');
      setupMockApi(parameters);
      return story();
    },
  ],
};

const Template = (args) => <CreateAnnualExpenseDialog budgetId={5} periods={12} {...args} />;

export const Monthly = Template.bind({});

export const Weekly = Template.bind({});
Weekly.args = { periods: 52 };
