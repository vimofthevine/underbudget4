import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import React from 'react';

import TablePagination from 'common/components/TablePagination';
import useErrorMessage from 'common/hooks/useErrorMessage';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import { reconciliationRoute } from 'common/utils/routes';
import useFetchReconciliations from '../hooks/useFetchReconciliations';
import ReconciliationsList from './ReconciliationsList';

const AccountReconciliationsList = ({ accountId }) => {
  const navigate = useNavigateKeepingSearch();
  const handleSelectReconciliation = (id) => navigate(reconciliationRoute(id));

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve reconciliations' });

  const { data, error, isError, isFetching, isLoading } = useFetchReconciliations({
    accountId,
    defaultSize: 25,
  });
  const errorMessage = createErrorMessage(error);
  const count = data ? data.total : 0;
  const reconciliations = data ? data.reconciliations : [];

  return (
    <>
      <ReconciliationsList
        onSelect={handleSelectReconciliation}
        reconciliations={reconciliations}
      />
      {(isLoading || isFetching) && <LinearProgress />}
      {isError && <Alert severity='error'>{errorMessage}</Alert>}
      <TablePagination count={count} defaultSize={25} labelRowsPerPage='Reconciliations per page' />
    </>
  );
};

AccountReconciliationsList.propTypes = {
  accountId: PropTypes.number.isRequired,
};

export default AccountReconciliationsList;
