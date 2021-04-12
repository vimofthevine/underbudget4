import axios from 'axios';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useQuery } from 'react-query';

import useErrorMessage from '../../common/hooks/useErrorMessage';
import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';

export default function useAccounts() {
  const ledger = useSelectedLedger();

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve accounts' });

  const { data, error, status } = useQuery(
    ['account-categories', { ledger }],
    async () => {
      const { data: resp } = await axios.get(`/api/ledgers/${ledger}/account-categories`);
      return resp;
    },
    { enabled: !!ledger },
  );

  const categories = React.useMemo(
    () =>
      !data
        ? []
        : sortBy(data.categories, ['name']).map((c) => ({
            ...c,
            accounts: sortBy(c.accounts, ['name']),
          })),
    [data],
  );

  return {
    categories,
    error: createErrorMessage(error),
    status,
  };
}
