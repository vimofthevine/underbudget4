import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';

import Link from 'common/components/Link';
import useDeletePeriodicIncome from '../../hooks/useDeletePeriodicIncome';
import useFetchPeriodicIncomes from '../../hooks/useFetchPeriodicIncomes';
import IncomesList from '../IncomesList';

const PeriodicIncomesList = ({ budgetId }) => {
  const { error, incomes, status } = useFetchPeriodicIncomes({ budgetId });
  const { mutate } = useDeletePeriodicIncome({ budgetId });

  return (
    <>
      {status === 'success' && incomes.length === 0 && (
        <Alert severity='info'>
          No incomes defined (<Link to='create-periodic'>create one now</Link>)
        </Alert>
      )}
      {status === 'success' && <IncomesList incomes={incomes} onDelete={mutate} type='periodic' />}
      {status === 'loading' && <LinearProgress />}
      {status === 'error' && <Alert severity='error'>{error}</Alert>}
    </>
  );
};

PeriodicIncomesList.propTypes = {
  budgetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default PeriodicIncomesList;
