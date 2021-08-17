import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'common/components/Link';
import useDeletePeriodicExpense from '../../hooks/useDeletePeriodicExpense';
import useFetchPeriodicExpenses from '../../hooks/useFetchPeriodicExpenses';
import ExpensesList from '../ExpensesList';

const PeriodicExpensesList = ({ budgetId }) => {
  const { error, expenses, status } = useFetchPeriodicExpenses({ budgetId });
  const { mutate } = useDeletePeriodicExpense({ budgetId });

  return (
    <>
      {status === 'success' && expenses.length === 0 && (
        <Alert severity='info'>
          No expenses defined (<Link to='create-periodic'>create one now</Link>)
        </Alert>
      )}
      {status === 'success' && (
        <ExpensesList expenses={expenses} onDelete={mutate} type='periodic' />
      )}
      {status === 'loading' && <LinearProgress />}
      {status === 'error' && <Alert severity='error'>{error}</Alert>}
    </>
  );
};

PeriodicExpensesList.propTypes = {
  budgetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default PeriodicExpensesList;
