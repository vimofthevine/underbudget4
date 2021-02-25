import { useQueryClient } from 'react-query';

import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';

export default function useAccountsRefetch() {
  const queryClient = useQueryClient();
  const ledger = useSelectedLedger();

  return () => queryClient.invalidateQueries(['accountCategories', { ledger }]);
}
