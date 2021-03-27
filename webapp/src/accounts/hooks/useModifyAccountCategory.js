import axios from 'axios';
import useErrorMessage from '../../common/hooks/useErrorMessage';
import useMutation from '../../common/hooks/useMutation';
import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation(
    ({ created, id, lastUpdated, ...data }) => axios.put(`/api/account-categories/${id}`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to modify account category' }),
      refetchQueries: [['account-categories', { ledger }]],
      ...opts,
    },
  );
};
