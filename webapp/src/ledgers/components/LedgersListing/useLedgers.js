import React from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useMobile from '../../../common/hooks/useMobile';
import { ACCOUNTS } from '../../../common/utils/routes';
import scrollToTop from '../../../common/utils/scrollToTop';
import fetchLedgers from '../../api/fetchLedgers';
import setSelectedLedger from '../../utils/setSelectedLedger';
import { useLedgersState } from '../LedgersContext';

// eslint-disable-next-line import/prefer-default-export
export function useLedgers() {
  const location = useLocation();
  const navigate = useNavigate();
  const mobile = useMobile();
  const state = useLedgersState();

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve ledgers' });

  const { error, isFetching, data, status } = useQuery(
    ['ledgers', state.pagination],
    () => fetchLedgers(state.pagination),
    { keepPreviousData: true },
  );
  const ledgers = data ? data._embedded.ledgers : [];
  const count = data ? data.page.totalElements : 0;

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
