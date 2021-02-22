import { useQueryCache } from 'react-query';

import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';

export default function useAccountsRefetch() {
  const queryCache = useQueryCache();
  const ledger = useSelectedLedger();

  return () => queryCache.invalidateQueries(['accountCategories', { ledger }]);
}
