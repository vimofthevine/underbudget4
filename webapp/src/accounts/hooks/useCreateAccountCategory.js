import axios from 'axios';
import useErrorMessage from '../../common/hooks/useErrorMessage';
import useMutation from '../../common/hooks/useMutation';
import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';

export default ({ ledger: overrideLedger, ...opts } = {}) => {
  const selectedLedger = useSelectedLedger();
  const ledger = overrideLedger || selectedLedger;
  return useMutation((data) => axios.post(`/api/ledgers/${ledger}/account-categories`, data), {
    createErrorMessage: useErrorMessage({ request: 'Unable to create account category' }),
    refetchQueries: [['account-categories', { ledger }]],
    ...opts,
  });
};
