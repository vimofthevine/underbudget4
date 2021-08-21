import axios from 'axios';
import toString from 'lodash/toString';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

export default (budgetId, opts) => {
  return useMutation(
    ({ created, lastUpdated, id, ...data }) =>
      axios.put(`/api/budget-periodic-expenses/${id}`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to modify periodic expense' }),
      refetchQueries: (_, { id }) => [
        ['budget-periodic-expense', toString(id)],
        ['budget-periodic-expenses', { budgetId }],
      ],
      ...opts,
    },
  );
};
