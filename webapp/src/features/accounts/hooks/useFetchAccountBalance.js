import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['account-balance', id],
    async () => {
      const { data } = await axios.get(`/api/accounts/${id}/balance`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
