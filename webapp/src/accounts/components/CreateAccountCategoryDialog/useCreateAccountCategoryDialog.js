import { useMutation } from 'react-query';

import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useSnackbar from '../../../common/hooks/useSnackbar';
import useSelectedLedger from '../../../ledgers/hooks/useSelectedLedger';
import createAccountCategory from '../../api/createAccountCategory';
import { useAccountDispatch, useAccountState } from '../../contexts/account';
import useAccountsRefetch from '../../hooks/useAccountsRefetch';

export default function useCreateAccountCategoryDialog() {
  const snackbar = useSnackbar();
  const dispatch = useAccountDispatch();
  const state = useAccountState();
  const ledger = useSelectedLedger();
  const refetch = useAccountsRefetch();

  const dialogOpen = state.showCreateAccountCategory;
  const handleCloseDialog = () => dispatch({ type: 'hideCreateAccountCategory' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to create account category' });

  const { mutate } = useMutation(createAccountCategory, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      refetch();
      handleCloseDialog();
    },
  });

  const handleCreate = (values) => mutate({ ...values, ledger: `/api/ledgers/${ledger}` });

  return {
    dialogOpen,
    handleCloseDialog,
    handleCreate,
  };
}
