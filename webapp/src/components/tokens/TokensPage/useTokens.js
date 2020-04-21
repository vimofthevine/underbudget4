import { useQuery } from 'react-query';

import fetchTokens from '../../../api/tokens/fetchTokens';
import useMobile from '../../../hooks/useMobile';

// eslint-disable-next-line import/prefer-default-export
export function useTokens() {
  const mobile = useMobile();

  const { data, error, status } = useQuery('tokens', fetchTokens);
  const tokens = data ? data._embedded.tokens : [];

  return {
    error,
    mobile,
    status,
    tokens,
  };
}
