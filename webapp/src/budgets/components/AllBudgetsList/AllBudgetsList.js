import React from 'react';

import useFetchBudgets from '../../hooks/useFetchBudgets';
import BudgetsList from '../BudgetsList';

const AllBudgetsList = () => <BudgetsList useFetchBudgets={useFetchBudgets} />;

export default AllBudgetsList;
