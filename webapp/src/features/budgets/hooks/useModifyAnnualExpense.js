import axios from 'axios';
import toString from 'lodash/toString';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

export default (budgetId, opts) => {
  return useMutation(
    ({ created, lastUpdated, id, ...data }) => axios.put(`/api/budget-annual-expenses/${id}`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to modify annual expense' }),
      refetchQueries: (_, { id }) => [
        ['budget-annual-expense', toString(id)],
        ['budget-annual-expenses', { budgetId }],
      ],
      ...opts,
    },
  );
};
