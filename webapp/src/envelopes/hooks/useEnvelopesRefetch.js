import { useQueryCache } from 'react-query';

import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';

export default function useEnvelopesRefetch() {
  const queryCache = useQueryCache();
  const ledger = useSelectedLedger();

  return () => queryCache.invalidateQueries(['envelopeCategories', { ledger }]);
}
