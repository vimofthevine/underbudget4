import axios from 'axios';
import toString from 'lodash/toString';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';
import useSelectedLedger from 'common/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation(
    ({ created, id, lastUpdated, ...data }) => axios.put(`/api/accounts/${id}`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to modify account' }),
      refetchQueries: (_, { id }) => [
        ['account', toString(id)],
        ['account-categories', { ledger }],
      ],
      ...opts,
    },
  );
};
