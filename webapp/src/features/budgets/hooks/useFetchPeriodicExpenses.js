import axios from 'axios';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useQuery } from 'react-query';

import useErrorMessage from 'common/hooks/useErrorMessage';
import { useEnvelopeName } from 'features/envelopes';

export default ({ budgetId }, opts) => {
  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve periodic expenses' });
  const envelopeName = useEnvelopeName();

  const { data, error, status } = useQuery(
    ['budget-periodic-expenses', { budgetId }],
    async () => {
      const { data: resp } = await axios.get(`/api/budgets/${budgetId}/periodic-expenses`);
      return resp;
    },
    { enabled: !!budgetId, ...opts },
  );

  const expenses = React.useMemo(() => {
    if (!data) {
      return [];
    }
    return sortBy(
      data.expenses.map((expense) => ({
        envelope: envelopeName(expense.envelopeId),
        ...expense,
      })),
      ['envelope', 'name'],
    );
  }, [data]);

  return {
    expenses,
    error: createErrorMessage(error),
    status,
  };
};
