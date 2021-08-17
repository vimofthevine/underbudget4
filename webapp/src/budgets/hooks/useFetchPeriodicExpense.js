import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['budget-periodic-expense', id],
    async () => {
      const { data } = await axios.get(`/api/budget-periodic-expenses/${id}`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
