import axios from 'axios';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

export default ({ budgetId }, opts) =>
  useMutation((id) => axios.delete(`/api/budget-periodic-expenses/${id}`), {
    createErrorMessage: useErrorMessage({ request: 'Unable to delete periodic expense' }),
    refetchQueries: [['budget-periodic-expenses', { budgetId }]],
    ...opts,
  });
