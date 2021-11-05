import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'common/components/Link';
import useDeleteAnnualExpense from '../hooks/useDeleteAnnualExpense';
import useFetchAnnualExpenses from '../hooks/useFetchAnnualExpenses';
import ExpensesList from './ExpensesList';

const AnnualExpensesList = ({ budgetId }) => {
  const { error, expenses, status } = useFetchAnnualExpenses({ budgetId });
  const { mutate } = useDeleteAnnualExpense({ budgetId });

  return (
    <>
      {status === 'success' && expenses.length === 0 && (
        <Alert severity='info'>
          No expenses defined (<Link to='create-annual'>create one now</Link>)
        </Alert>
      )}
      {status === 'success' && <ExpensesList expenses={expenses} onDelete={mutate} type='annual' />}
      {status === 'loading' && <LinearProgress />}
      {status === 'error' && <Alert severity='error'>{error}</Alert>}
    </>
  );
};

AnnualExpensesList.propTypes = {
  budgetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default AnnualExpensesList;
