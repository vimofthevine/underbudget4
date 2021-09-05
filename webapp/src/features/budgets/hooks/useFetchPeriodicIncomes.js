import axios from 'axios';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useQuery } from 'react-query';

import useErrorMessage from 'common/hooks/useErrorMessage';

export default ({ budgetId }, opts) => {
  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve periodic incomes' });

  const { data, error, status } = useQuery(
    ['budget-periodic-incomes', { budgetId }],
    async () => {
      const { data: resp } = await axios.get(`/api/budgets/${budgetId}/periodic-incomes`);
      return resp;
    },
    { enabled: !!budgetId, ...opts },
  );

  const incomes = React.useMemo(() => {
    if (!data) {
      return [];
    }
    return sortBy(data.incomes, ['name']);
  }, [data]);

  return {
    incomes,
    error: createErrorMessage(error),
    status,
  };
};
