import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['transaction', id],
    async () => {
      const { data } = await axios.get(`/api/transactions/${id}`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
