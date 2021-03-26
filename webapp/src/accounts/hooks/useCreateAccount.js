import axios from 'axios';
import useErrorMessage from '../../common/hooks/useErrorMessage';
import useMutation from '../../common/hooks/useMutation';
import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation(
    ({ category, ...data }) => axios.post(`/api/account-categories/${category}/accounts`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to create account' }),
      refetchQueries: [['account-categories', { ledger }]],
      ...opts,
    },
  );
};
