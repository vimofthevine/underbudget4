import { useMutation } from 'react-query';

import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useSnackbar from '../../../common/hooks/useSnackbar';
import createAccount from '../../api/createAccount';
import { useAccountDispatch, useAccountState } from '../../contexts/account';
import useAccountsRefetch from '../../hooks/useAccountsRefetch';

export default function useCreateAccountDialog() {
  const snackbar = useSnackbar();
  const dispatch = useAccountDispatch();
  const state = useAccountState();
  const refetch = useAccountsRefetch();

  const dialogOpen = state.showCreateAccount;
  const handleCloseDialog = () => dispatch({ type: 'hideCreateAccount' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to create account' });

  const { mutate } = useMutation(createAccount, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      refetch();
      handleCloseDialog();
    },
  });

  const handleCreate = ({ category, ...values }) =>
    mutate({ ...values, category: `/api/account-categories/${category}` });

  return {
    dialogOpen,
    handleCloseDialog,
    handleCreate,
  };
}
