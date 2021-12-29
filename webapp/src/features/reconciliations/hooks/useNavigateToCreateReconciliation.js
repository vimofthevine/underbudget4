import { useLocation } from 'react-router';

import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import { createReconciliationRoute } from 'common/utils/routes';

export default function useNavigateToCreateReconciliation(accountId) {
  const location = useLocation();
  const navigate = useNavigateKeepingSearch();

  const createRoute = createReconciliationRoute(accountId);
  return () => navigate(createRoute, { state: { from: location } });
}
