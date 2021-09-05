import axios from 'axios';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

export default () => {
  const [searchParams] = useSearchParams({ page: 1, size: 10 });
  const page = searchParams.get('page');
  const size = searchParams.get('size');

  return {
    ...useQuery(
      ['ledgers', { page, size }],
      async () => {
        const { data } = await axios.get(`/api/ledgers?page=${page}&size=${size}`);
        return data;
      },
      { keepPreviousData: true },
    ),
    pagination: {
      page,
      size,
    },
  };
};
