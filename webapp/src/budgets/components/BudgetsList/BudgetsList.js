import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';

import BudgetCard from '../BudgetCard';

const BudgetsList = ({ useFetchBudgets }) => {
  const { budgets, error, status } = useFetchBudgets();

  return (
    <>
      {status === 'success' &&
        budgets.map((budget) => <BudgetCard budget={budget} key={budget.id} />)}
      {status === 'loading' && <LinearProgress />}
      {status === 'error' && <Alert severity='error'>{error}</Alert>}
    </>
  );
};

BudgetsList.propTypes = {
  useFetchBudgets: PropTypes.func.isRequired,
};

export default BudgetsList;
