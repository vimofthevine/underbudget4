import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ accountId, enabled = true, ...opts } = {}) =>
  useQuery(
    ['last-reconciliation', accountId],
    async () => {
      const { data } = await axios.get(`/api/accounts/${accountId}/reconciliations/last`);
      return data;
    },
    { enabled: enabled && !!accountId, ...opts },
  );
