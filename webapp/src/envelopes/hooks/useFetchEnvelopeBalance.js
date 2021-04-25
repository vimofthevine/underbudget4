import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['envelope-balance', id],
    async () => {
      const { data } = await axios.get(`/api/envelopes/${id}/balance`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
