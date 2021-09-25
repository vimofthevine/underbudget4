import axios from 'axios';
import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

export default ({ accountId, ...opts }) => {
  return useMutation(
    ({ reconciledBalance, reconciledBalanceDiff, ...data }) =>
      axios.post(`/api/accounts/${accountId}/reconciliations`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to create reconciliation' }),
      refetchQueries: [['reconciliations', { accountId }]],
      ...opts,
    },
  );
};
