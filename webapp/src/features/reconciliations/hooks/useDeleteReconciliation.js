import axios from 'axios';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

export default (opts) =>
  useMutation(({ reconciliationId }) => axios.delete(`/api/reconciliations/${reconciliationId}`), {
    createErrorMessage: useErrorMessage({ request: 'Unable to delete reconciliation' }),
    refetchQueries: (_, { accountId }) => [['reconciliations', { accountId }]],
    ...opts,
  });
