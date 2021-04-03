import axios from 'axios';
import useErrorMessage from '../../common/hooks/useErrorMessage';
import useMutation from '../../common/hooks/useMutation';
import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation(
    ({ created, id, lastUpdated, ...data }) => axios.put(`/api/accounts/${id}`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to modify account' }),
      refetchQueries: (_, { id }) => [
        ['account', id],
        ['account-categories', { ledger }],
      ],
      ...opts,
    },
  );
};
