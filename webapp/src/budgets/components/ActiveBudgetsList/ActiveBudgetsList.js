import React from 'react';

import useFetchActiveBudgets from '../../hooks/useFetchActiveBudgets';
import BudgetsList from '../BudgetsList';

const ActiveBudgetsList = () => <BudgetsList useFetchBudgets={useFetchActiveBudgets} />;

export default ActiveBudgetsList;
