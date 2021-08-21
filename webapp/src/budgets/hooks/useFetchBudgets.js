import axios from 'axios';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useQuery } from 'react-query';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useSelectedLedger from 'common/hooks/useSelectedLedger';

export default () => {
  const ledger = useSelectedLedger();
  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve budgets' });

  const { data, error, status } = useQuery(
    ['budgets', { ledger }],
    async () => {
      const { data: resp } = await axios.get(`/api/ledgers/${ledger}/budgets`);
      return resp;
    },
    { enabled: !!ledger },
  );

  const budgets = React.useMemo(() => {
    if (!data) {
      return [];
    }
    return sortBy(data.budgets, ['name']);
  }, [data]);

  return {
    budgets,
    error: createErrorMessage(error),
    status,
  };
};
