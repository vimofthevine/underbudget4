import React from 'react';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import { standardLedgerResponses } from 'tests/setupMockApi';
import ExpenseSummary from './ExpenseSummary';

export default {
  title: 'budgets/ExpenseSummary',
  component: ExpenseSummary,
  decorators: [
    (story) => {
      setSelectedLedger('2');
      return story();
    },
  ],
  parameters: {
    api: {
      get: standardLedgerResponses,
    },
  },
};

const Template = (args) => <ExpenseSummary budgetId={5} periods={1} {...args} />;

export const FetchError = Template.bind({});

export const NoExpenses = Template.bind({});
NoExpenses.parameters = {
  api: {
    get: [
      ...standardLedgerResponses,
      [/\/api\/budgets\/5\/budgeted-expenses\/.*/, { expensesByEnvelopeId: {} }],
    ],
  },
};

export const OneExpense = Template.bind({});
OneExpense.parameters = {
  api: {
    get: [
      ...standardLedgerResponses,
      [
        /\/api\/budgets\/5\/budgeted-expenses\/.*/,
        {
          expensesByEnvelopeId: { 1: 6500 },
        },
      ],
    ],
  },
};

export const SeveralExpenses = Template.bind({});
SeveralExpenses.parameters = {
  api: {
    get: [
      ...standardLedgerResponses,
      [
        /\/api\/budgets\/5\/budgeted-expenses\/.*/,
        {
          expensesByEnvelopeId: {
            3: 17000,
            4: 2500,
            1: 6500,
          },
        },
      ],
    ],
  },
};

export const WeeklyPeriods = Template.bind({});
WeeklyPeriods.args = { periods: 52 };
WeeklyPeriods.parameters = {
  api: {
    get: [
      ...standardLedgerResponses,
      ...[...Array(52)].map((_, i) => [
        `/api/budgets/5/budgeted-expenses/${i}`,
        { expensesByEnvelopeId: { 1: (i + 1) * 100 } },
      ]),
    ],
  },
};

export const BiweeklyPeriods = Template.bind({});
BiweeklyPeriods.args = { periods: 26 };
BiweeklyPeriods.parameters = WeeklyPeriods.parameters;

export const SemimonthlyPeriods = Template.bind({});
SemimonthlyPeriods.args = { periods: 24 };
SemimonthlyPeriods.parameters = WeeklyPeriods.parameters;

export const MonthlyPeriods = Template.bind({});
MonthlyPeriods.args = { periods: 12 };
MonthlyPeriods.parameters = WeeklyPeriods.parameters;

export const BimonthlyPeriods = Template.bind({});
BimonthlyPeriods.args = { periods: 6 };
BimonthlyPeriods.parameters = WeeklyPeriods.parameters;

export const QuarterlyPeriods = Template.bind({});
QuarterlyPeriods.args = { periods: 4 };
QuarterlyPeriods.parameters = WeeklyPeriods.parameters;

export const TriannualPeriods = Template.bind({});
TriannualPeriods.args = { periods: 3 };
TriannualPeriods.parameters = WeeklyPeriods.parameters;

export const BiannualPeriods = Template.bind({});
BiannualPeriods.args = { periods: 2 };
BiannualPeriods.parameters = WeeklyPeriods.parameters;

export const AnnualPeriods = Template.bind({});
AnnualPeriods.args = { periods: 1 };
AnnualPeriods.parameters = WeeklyPeriods.parameters;
