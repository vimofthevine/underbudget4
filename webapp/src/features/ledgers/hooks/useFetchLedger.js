import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['ledger', id],
    async () => {
      const { data } = await axios.get(`/api/ledgers/${id}`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
