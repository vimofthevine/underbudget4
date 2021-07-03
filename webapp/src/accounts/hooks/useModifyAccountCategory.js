import axios from 'axios';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';
import useSelectedLedger from 'common/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation(
    ({ accounts, created, id, lastUpdated, ...data }) =>
      axios.put(`/api/account-categories/${id}`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to modify account category' }),
      refetchQueries: (_, { id }) => [
        ['account-categories', { ledger }],
        ['account-category', id],
      ],
      ...opts,
    },
  );
};
