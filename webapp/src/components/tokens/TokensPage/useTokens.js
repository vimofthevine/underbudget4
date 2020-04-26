import { queryCache, useMutation, useQuery } from 'react-query';

import deleteToken from '../../../api/tokens/deleteToken';
import fetchTokens from '../../../api/tokens/fetchTokens';
import useErrorMessage from '../../../hooks/useErrorMessage';
import useMobile from '../../../hooks/useMobile';
import { useConfirmation } from '../../common/ConfirmationService';
import { useSnackbar } from '../../common/SnackbarService';

// eslint-disable-next-line import/prefer-default-export
export function useTokens() {
  const mobile = useMobile();
  const confirm = useConfirmation();
  const snackbar = useSnackbar();

  const fetchErrorMessage = useErrorMessage({ request: 'Unable to retrieve access tokens' });
  const deleteErrorMessage = useErrorMessage({ request: 'Unable to delete access token' });

  const { data, error, status } = useQuery('tokens', fetchTokens);
  const tokens = data ? data._embedded.tokens : [];

  const [mutate] = useMutation(deleteToken, {
    onError: (err) => snackbar(deleteErrorMessage(err)),
    onSuccess: () => {
      queryCache.refetchQueries('tokens');
    },
  });

  const handleDelete = (token) =>
    confirm({ message: 'Delete access token?' }).then(() => {
      mutate(token.jwtId);
    });

  return {
    error: fetchErrorMessage(error),
    handleDelete,
    mobile,
    status,
    tokens,
  };
}
