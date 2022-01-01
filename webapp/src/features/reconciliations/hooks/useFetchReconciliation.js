import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id, enabled = true, ...opts } = {}) =>
  useQuery(
    ['reconciliation', id],
    async () => {
      const { data } = await axios.get(`/api/reconciliations/${id}`);
      return data;
    },
    { enabled: enabled && !!id, ...opts },
  );
