import axios from 'axios';
import toString from 'lodash/toString';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

export default (budgetId, opts) => {
  return useMutation(
    ({ created, lastUpdated, id, ...data }) =>
      axios.put(`/api/budget-periodic-incomes/${id}`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to modify periodic income' }),
      refetchQueries: (_, { id }) => [
        ['budget-periodic-income', toString(id)],
        ['budget-periodic-incomes', { budgetId }],
      ],
      ...opts,
    },
  );
};
