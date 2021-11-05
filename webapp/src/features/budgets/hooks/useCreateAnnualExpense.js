import axios from 'axios';
import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

export default (budgetId, opts) => {
  return useMutation((data) => axios.post(`/api/budgets/${budgetId}/annual-expenses`, data), {
    createErrorMessage: useErrorMessage({ request: 'Unable to create annual expense' }),
    refetchQueries: [['budget-annual-expenses', { budgetId }]],
    ...opts,
  });
};
