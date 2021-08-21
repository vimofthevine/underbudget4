import axios from 'axios';
import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';
import useSelectedLedger from 'common/hooks/useSelectedLedger';

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation((data) => axios.post(`/api/ledgers/${ledger}/active-budgets`, data), {
    createErrorMessage: useErrorMessage({ request: 'Unable to set active budget' }),
    refetchQueries: [['active-budgets', { ledger }]],
    ...opts,
  });
};
