import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

import LedgerPagination from '../LedgerPagination';
import LedgersTable from '../LedgersTable';
import { useLedgers } from './useLedgers';

const LedgersListing = () => {
  const { count, error, handleSelect, isFetching, ledgers, mobile, status } = useLedgers();

  return (
    <>
      <LedgersTable mobile={mobile} ledgers={ledgers} onSelect={handleSelect} />
      {(status === 'loading' || isFetching) && <LinearProgress />}
      {status === 'error' && <Alert severity='error'>{error}</Alert>}
      {count > 10 && <LedgerPagination count={count} />}
    </>
  );
};

export default LedgersListing;
