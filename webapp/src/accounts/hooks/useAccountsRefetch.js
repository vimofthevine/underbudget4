import { useQueryCache } from 'react-query';

import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';

export function useAccountsRefetch() {
  const queryCache = useQueryCache();
  const ledger = useSelectedLedger();

  return () => queryCache.refetchQueries(['accountCategories', { ledger }]);
}
