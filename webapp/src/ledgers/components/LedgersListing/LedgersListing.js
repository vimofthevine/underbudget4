import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useMobile from '../../../common/hooks/useMobile';
import { ACCOUNTS } from '../../../common/utils/routes';
import scrollToTop from '../../../common/utils/scrollToTop';
import useFetchLedgers from '../../hooks/useFetchLedgers';
import setSelectedLedger from '../../utils/setSelectedLedger';
import LedgerPagination from '../LedgerPagination';
import LedgersTable from '../LedgersTable';

const LedgersListing = () => {
  const mobile = useMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve ledgers' });

  const { data, error, isError, isFetching, isLoading, pagination } = useFetchLedgers();
  const errorMessage = createErrorMessage(error);
  const count = data ? data.total : 0;
  const ledgers = data ? data.ledgers : [];

  React.useEffect(() => {
    if (!isFetching) {
      scrollToTop();
    }
  }, [isFetching]);

  const handleSelect = React.useCallback(
    (ledger) => {
      setSelectedLedger(ledger.id);
      const { from } = location.state || { from: { pathname: ACCOUNTS } };
      navigate(from);
    },
    [location, navigate],
  );

  return (
    <>
      <LedgersTable mobile={mobile} ledgers={ledgers} onSelect={handleSelect} />
      {(isLoading || isFetching) && <LinearProgress />}
      {isError && <Alert severity='error'>{errorMessage}</Alert>}
      {count > pagination.size && <LedgerPagination count={count} />}
    </>
  );
};

export default LedgersListing;
