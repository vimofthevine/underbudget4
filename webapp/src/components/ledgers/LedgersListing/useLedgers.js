import React from 'react';
import { usePaginatedQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import fetchLedgers from '../../../api/ledgers/fetchLedgers';
import useErrorMessage from '../../../hooks/useErrorMessage';
import useMobile from '../../../hooks/useMobile';
import { ACCOUNTS } from '../../../utils/routes';
import scrollToTop from '../../../utils/scrollToTop';
import setSelectedLedger from '../../../utils/setSelectedLedger';
import { useLedgersState } from '../LedgersContext';

// eslint-disable-next-line import/prefer-default-export
export function useLedgers() {
  const location = useLocation();
  const navigate = useNavigate();
  const mobile = useMobile();
  const state = useLedgersState();

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve ledgers' });

  const { error, isFetching, resolvedData, status } = usePaginatedQuery(
    ['ledgers', state.pagination],
    fetchLedgers,
  );
  const ledgers = resolvedData ? resolvedData._embedded.ledgers : [];
  const count = resolvedData ? resolvedData.page.totalElements : 0;

  React.useEffect(() => {
    if (!isFetching) {
      scrollToTop();
    }
  }, [isFetching]);

  const handleSelect = React.useCallback((ledger) => {
    setSelectedLedger(ledger.id);
    const { from } = location.state || { from: { pathname: ACCOUNTS } };
    navigate(from);
  }, []);

  return {
    count,
    error: createErrorMessage(error),
    handleSelect,
    isFetching,
    ledgers,
    mobile,
    status,
  };
}
