import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';

import useErrorMessage from 'common/hooks/useErrorMessage';
import usePagination from 'common/hooks/usePagination';
import { Transactions } from 'features/transactions';
import useFetchReconciliationTransactions from '../hooks/useFetchReconciliationTransactions';

const ReconciledTransactions = ({ reconciliationId }) => {
  const { Pagination, paginationProps, page, size } = usePagination({
    label: 'Transactions per page',
  });

  const { data, error, isError, isFetching, isLoading } = useFetchReconciliationTransactions({
    id: reconciliationId,
    page,
    size,
  });
  const count = data ? data.total : 0;
  const transactions = data ? data.transactions : [];

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve transactions' });
  const errorMessage = createErrorMessage(error);

  return (
    <>
      <Transactions loading={isLoading} transactions={transactions} />
      {isFetching && <LinearProgress />}
      {isError && <Alert severity='error'>{errorMessage}</Alert>}
      {count > size && <Pagination {...paginationProps} count={count} />}
    </>
  );
};

ReconciledTransactions.propTypes = {
  reconciliationId: PropTypes.number.isRequired,
};

export default ReconciledTransactions;
