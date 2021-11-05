import axios from 'axios';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';
import useSelectedLedger from 'common/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation(
    ({ categoryId, ...data }) =>
      axios.post(`/api/envelope-categories/${categoryId}/envelopes`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to create envelope' }),
      refetchQueries: [['envelope-categories', { ledger }]],
      ...opts,
    },
  );
};
