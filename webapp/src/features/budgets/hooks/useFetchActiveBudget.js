import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['active-budget', id],
    async () => {
      const { data } = await axios.get(`/api/active-budgets/${id}`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
