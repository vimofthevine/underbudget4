import sortBy from 'lodash/sortBy';
import React from 'react';
import { useQuery } from 'react-query';

import useErrorMessage from '../../common/hooks/useErrorMessage';
import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';
import fetchAccountCategories from '../api/fetchAccountCategories';

export default function useAccounts() {
  const ledger = useSelectedLedger();

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve accounts' });

  const { data, error, status } = useQuery(
    ['accountCategories', { ledger }],
    () => fetchAccountCategories(ledger),
    { enabled: !!ledger },
  );
  const unsorted = data ? data._embedded.accountCategories : [];

  const categories = React.useMemo(
    () =>
      sortBy(unsorted, ['name']).map((c) => ({
        ...c,
        accounts: sortBy(c.accounts, ['name']),
      })),
    [unsorted],
  );

  return {
    categories,
    error: createErrorMessage(error),
    status,
  };
}
