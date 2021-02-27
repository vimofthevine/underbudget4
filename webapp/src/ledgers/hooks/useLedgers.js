import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ page, size }) =>
  useQuery(
    ['ledgers', { page, size }],
    async () => {
      const { data } = await axios.get(`/api/ledgers?page=${page}&size=${size}`);
      return data;
    },
    { keepPreviousData: true },
  );
