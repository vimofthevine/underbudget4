import axios from 'axios';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useQuery } from 'react-query';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useEnvelopeName from 'envelopes/hooks/useEnvelopeName';

export default ({ budgetId, period }, opts) => {
  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve budgeted expenses' });
  const envelopeName = useEnvelopeName();

  const { data, error, status } = useQuery(
    ['budgeted-expenses', { budgetId, period }],
    async () => {
      const { data: resp } = await axios.get(
        `/api/budgets/${budgetId}/budgeted-expenses/${period}`,
      );
      return resp;
    },
    { enabled: !!budgetId, ...opts },
  );

  const expenses = React.useMemo(() => {
    if (!data) {
      return [];
    }
    return sortBy(
      Object.keys(data.expensesByEnvelopeId)
        .map((id) => parseInt(id, 10))
        .map((envelopeId) => ({
          envelopeId,
          name: envelopeName(envelopeId),
          amount: data.expensesByEnvelopeId[envelopeId],
        })),
      ['name'],
    );
  }, [data, envelopeName]);

  return {
    error: createErrorMessage(error),
    expenses,
    status,
  };
};
