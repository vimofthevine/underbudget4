import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['budget', id],
    async () => {
      const { data } = await axios.get(`/api/budgets/${id}`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
