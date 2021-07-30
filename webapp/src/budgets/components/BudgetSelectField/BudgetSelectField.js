// Disable rule because this is a generic component
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';

import EntitySelectField from 'common/components/EntitySelectField';
import useFetchBudgets from '../../hooks/useFetchBudgets';

const BudgetSelectField = (props) => {
  const { budgets } = useFetchBudgets();
  return <EntitySelectField {...props} entities={budgets} />;
};

export default BudgetSelectField;
