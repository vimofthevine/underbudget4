import axios from 'axios';

import useErrorMessage from '../../common/hooks/useErrorMessage';
import useMutation from '../../common/hooks/useMutation';
import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation((id) => axios.delete(`/api/accounts/${id}`), {
    createErrorMessage: useErrorMessage({ request: 'Unable to delete account' }),
    refetchQueries: [['account-categories', { ledger }]],
    ...opts,
  });
};
