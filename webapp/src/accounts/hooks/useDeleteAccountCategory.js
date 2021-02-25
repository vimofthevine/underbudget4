import { useMutation } from 'react-query';

import useConfirmation from '../../common/hooks/useConfirmation';
import useErrorMessage from '../../common/hooks/useErrorMessage';
import useSnackbar from '../../common/hooks/useSnackbar';
import deleteAccountCategory from '../api/deleteAccountCategory';
import useAccountsRefetch from './useAccountsRefetch';

export default function useDeleteAccountCategory(category) {
  const confirm = useConfirmation();
  const snackbar = useSnackbar();
  const refetch = useAccountsRefetch();

  const createErrorMessage = useErrorMessage({ request: 'Unable to delete account category' });

  const { mutate } = useMutation(deleteAccountCategory, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: refetch,
  });

  return () =>
    confirm({
      message: [
        `Delete account category ${category.name}?`,
        'This action is permanent and cannot be undone.',
      ],
    }).then(() => {
      mutate(category.id);
    });
}
