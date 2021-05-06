import axios from 'axios';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

export default ({ defaultSize = 25, id }) => {
  const [searchParams] = useSearchParams({ page: 1, size: defaultSize });
  const page = searchParams.get('page');
  const size = searchParams.get('size');

  return {
    ...useQuery(
      ['envelope-transactions', { id, page, size }],
      async () => {
        const { data } = await axios.get(
          `/api/envelopes/${id}/transactions?page=${page}&size=${size}`,
        );
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
