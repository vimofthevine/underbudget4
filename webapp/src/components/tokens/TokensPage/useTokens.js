import { queryCache, useMutation, useQuery } from 'react-query';

import deleteToken from '../../../api/tokens/deleteToken';
import fetchTokens from '../../../api/tokens/fetchTokens';
import useMobile from '../../../hooks/useMobile';
import { useConfirmation } from '../../common/ConfirmationService';

// eslint-disable-next-line import/prefer-default-export
export function useTokens() {
  const mobile = useMobile();
  const confirm = useConfirmation();

  const { data, error, status } = useQuery('tokens', fetchTokens);
  const tokens = data ? data._embedded.tokens : [];

  const [mutate] = useMutation(deleteToken, {
    onSuccess: () => {
      queryCache.refetchQueries('tokens');
    },
  });

  const handleDelete = (token) =>
    confirm({ message: 'Delete access token?' }).then(() => {
      mutate(token.id);
    });

  return {
    error,
    handleDelete,
    mobile,
    status,
    tokens,
  };
}
