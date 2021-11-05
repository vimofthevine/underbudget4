import axios from 'axios';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';
import useSelectedLedger from 'common/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation(
    ({ envelopes, created, id, lastUpdated, ...data }) =>
      axios.put(`/api/envelope-categories/${id}`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to modify envelope category' }),
      refetchQueries: (_, { id }) => [
        ['envelope-categories', { ledger }],
        ['envelope-category', id],
      ],
      ...opts,
    },
  );
};
