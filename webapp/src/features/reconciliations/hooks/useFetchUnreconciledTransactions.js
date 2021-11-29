import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ accountId, page = 1, size = 25 }) =>
  useQuery(
    ['unreconciled-transactions', accountId, { page, size }],
    async () => {
      const { data } = await axios.get(
        `/api/accounts/${accountId}/unreconciled-transactions?page=${page}&size=${size}`,
      );
      return data;
    },
    { enabled: !!accountId, keepPreviousData: true },
  );
