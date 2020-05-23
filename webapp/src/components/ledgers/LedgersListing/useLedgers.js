import { usePaginatedQuery } from 'react-query';

import fetchLedgers from '../../../api/ledgers/fetchLedgers';
import useErrorMessage from '../../../hooks/useErrorMessage';
import useMobile from '../../../hooks/useMobile';
import { useLedgersState } from '../LedgersContext';

// eslint-disable-next-line import/prefer-default-export
export function useLedgers() {
  const mobile = useMobile();
  const state = useLedgersState();

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve ledgers' });

  const { error, isFetching, latestData, resolvedData, status } = usePaginatedQuery(
    ['ledgers', state.pagination],
    fetchLedgers,
  );
  const ledgers = resolvedData ? resolvedData._embedded.ledgers : [];
  const count = latestData ? latestData.page.totalElements : 0;

  return {
    count,
    error: createErrorMessage(error),
    handleSelect: () => 0,
    isFetching,
    ledgers,
    mobile,
    status,
  };
}
