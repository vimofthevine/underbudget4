import { useMutation } from 'react-query';

import useConfirmation from '../../common/hooks/useConfirmation';
import useErrorMessage from '../../common/hooks/useErrorMessage';
import useSnackbar from '../../common/hooks/useSnackbar';
import deleteAccount from '../api/deleteAccount';
import useAccountsRefetch from './useAccountsRefetch';

export function useDeleteAccount(account) {
  const confirm = useConfirmation();
  const snackbar = useSnackbar();
  const refetch = useAccountsRefetch();

  const createErrorMessage = useErrorMessage({ request: 'Unable to delete account' });

  const [mutate] = useMutation(deleteAccount, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: refetch,
  });

  return () =>
    confirm({
      message: [
        `Delete account ${account.name}?`,
        'This action is permanent and cannot be undone.',
      ],
    }).then(() => {
      mutate(account.id);
    });
}
