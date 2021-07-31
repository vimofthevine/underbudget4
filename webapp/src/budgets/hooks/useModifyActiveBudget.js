import axios from 'axios';
import toString from 'lodash/toString';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';
import useSelectedLedger from 'common/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation(({ budgetId, id }) => axios.put(`/api/active-budgets/${id}`, { budgetId }), {
    createErrorMessage: useErrorMessage({ request: 'Unable to modify active budget' }),
    refetchQueries: (_, { id }) => [
      ['active-budget', toString(id)],
      ['active-budgets', { ledger }],
    ],
    ...opts,
  });
};
