import axios from 'axios';
import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';
import useSelectedLedger from 'common/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation(
    ({ categoryId, ...data }) => axios.post(`/api/account-categories/${categoryId}/accounts`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to create account' }),
      refetchQueries: [['account-categories', { ledger }]],
      ...opts,
    },
  );
};
