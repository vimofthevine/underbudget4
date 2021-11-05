import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['budget-annual-expense', id],
    async () => {
      const { data } = await axios.get(`/api/budget-annual-expenses/${id}`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
