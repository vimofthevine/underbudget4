import axios from 'axios';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';
import useSelectedLedger from 'common/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation((id) => axios.delete(`/api/envelope-categories/${id}`), {
    createErrorMessage: useErrorMessage({ request: 'Unable to delete envelope category' }),
    refetchQueries: [['envelope-categories', { ledger }]],
    ...opts,
  });
};
