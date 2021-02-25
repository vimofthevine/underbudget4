import { useMutation } from 'react-query';

import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useSnackbar from '../../../common/hooks/useSnackbar';
import modifyAccountCategory from '../../api/modifyAccountCategory';
import { useAccountDispatch, useAccountState } from '../../contexts/account';
import useAccountsRefetch from '../../hooks/useAccountsRefetch';

const noCategory = {
  name: '',
};

export default function useCreateAccountCategory() {
  const snackbar = useSnackbar();
  const dispatch = useAccountDispatch();
  const state = useAccountState();
  const refetch = useAccountsRefetch();

  const dialogOpen = state.accountCategoryToModify !== null;
  const handleCloseDialog = () => dispatch({ type: 'hideModifyAccountCategory' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to modify account category' });

  const { mutate } = useMutation(modifyAccountCategory, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      refetch();
      handleCloseDialog();
    },
  });
  const handleModify = (values) =>
    mutate({
      ...values,
      accounts: undefined,
    });

  const category = state.accountCategoryToModify || noCategory;

  return {
    category,
    dialogOpen,
    handleCloseDialog,
    handleModify,
  };
}
