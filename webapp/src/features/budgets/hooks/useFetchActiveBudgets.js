import axios from 'axios';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useQuery } from 'react-query';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useSelectedLedger from 'common/hooks/useSelectedLedger';

export default () => {
  const ledger = useSelectedLedger();
  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve active budgets' });

  const { data, error, status } = useQuery(
    ['active-budgets', { ledger }],
    async () => {
      const { data: resp } = await axios.get(`/api/ledgers/${ledger}/active-budgets`);
      return resp;
    },
    { enabled: !!ledger },
  );

  const budgets = React.useMemo(() => {
    if (!data) {
      return [];
    }
    return reverse(sortBy(data.activeBudgets, ['year']));
  }, [data]);

  return {
    budgets,
    error: createErrorMessage(error),
    status,
  };
};
