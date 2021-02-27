import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useMobile from '../../../common/hooks/useMobile';
import { ACCOUNTS } from '../../../common/utils/routes';
import scrollToTop from '../../../common/utils/scrollToTop';
import useLedgers from '../../hooks/useLedgers';
import setSelectedLedger from '../../utils/setSelectedLedger';
import { useLedgersState } from '../LedgersContext';
import LedgerPagination from '../LedgerPagination';
import LedgersTable from '../LedgersTable';

const LedgersListing = () => {
  const mobile = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const state = useLedgersState();

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve ledgers' });

  const { data, error, isError, isFetching, isLoading } = useLedgers(state.pagination);
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
      {count > state.pagination.size && <LedgerPagination count={count} />}
    </>
  );
};

export default LedgersListing;
