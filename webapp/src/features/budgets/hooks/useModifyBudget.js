import axios from 'axios';
import toString from 'lodash/toString';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';
import useSelectedLedger from 'common/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation(
    ({ created, lastUpdated, id, ...data }) => axios.put(`/api/budgets/${id}`, data),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to modify budget' }),
      refetchQueries: (_, { id }) => [
        ['budget', toString(id)],
        ['budgets', { ledger }],
      ],
      ...opts,
    },
  );
};
