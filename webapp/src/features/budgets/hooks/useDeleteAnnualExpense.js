import axios from 'axios';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

export default ({ budgetId }, opts) =>
  useMutation((id) => axios.delete(`/api/budget-annual-expenses/${id}`), {
    createErrorMessage: useErrorMessage({ request: 'Unable to delete annual expense' }),
    refetchQueries: [['budget-annual-expenses', { budgetId }]],
    ...opts,
  });
