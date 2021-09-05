import { action } from '@storybook/addon-actions';
import React from 'react';

import AppProviders from 'common/components/AppProviders';
import { standardLedgerResponses } from 'test/setupMockApi';
import IncomesList from '../IncomesList';

export default {
  title: 'budgets/IncomesList',
  component: IncomesList,
  decorators: [(story) => <AppProviders>{story()}</AppProviders>],
  parameters: { api: { get: standardLedgerResponses } },
};

const Template = (args) => <IncomesList {...args} />;

export const NoIncomes = Template.bind({});
NoIncomes.args = {
  incomes: [],
  onDelete: action('delete'),
  type: 'periodic',
};

export const SeveralIncomes = Template.bind({});
SeveralIncomes.args = {
  incomes: [
    { id: 1, name: 'Income 1', amount: 123456 },
    { id: 2, name: 'Income 2', amount: 10000 },
    { id: 3, name: 'Income 3', amount: 3700 },
  ],
  onDelete: action('delete'),
  type: 'periodic',
};
