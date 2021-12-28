import axios from 'axios';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

export default ({ accountId, defaultSize = 25 }) => {
  const [searchParams] = useSearchParams({ page: 1, size: defaultSize });
  const page = searchParams.get('page');
  const size = searchParams.get('size');

  return {
    ...useQuery(
      ['reconciliations', accountId, { page, size }],
      async () => {
        const { data } = await axios.get(
          `/api/accounts/${accountId}/reconciliations?page=${page}&size=${size}`,
        );
        return data;
      },
      { enabled: !!accountId, keepPreviousData: true },
    ),
    pagination: {
      page,
      size,
    },
  };
};
