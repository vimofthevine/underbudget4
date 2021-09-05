import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['account', id],
    async () => {
      const { data } = await axios.get(`/api/accounts/${id}`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
