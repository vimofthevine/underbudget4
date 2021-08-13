import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['budget-periodic-income', id],
    async () => {
      const { data } = await axios.get(`/api/budget-periodic-incomes/${id}`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
