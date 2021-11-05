import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['account-category', id],
    async () => {
      const { data } = await axios.get(`/api/account-categories/${id}`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
