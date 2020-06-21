import sortBy from 'lodash/sortBy';
import React from 'react';
import { useQuery } from 'react-query';

import fetchAccountCategories from '../../../api/accounts/fetchAccountCategories';
import useErrorMessage from '../../../hooks/useErrorMessage';
import useSelectedLedger from '../../../hooks/useSelectedLedger';

export default function useAccounts() {
  const ledger = useSelectedLedger();

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve accounts' });

  const { data, error, status } = useQuery(
    ledger && ['accountCategories', { ledger }],
    fetchAccountCategories,
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
