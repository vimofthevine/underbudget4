import { useMutation, useQueryCache } from 'react-query';

import createAccount from '../../../accounts/api/createAccount';
import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useSnackbar from '../../../common/hooks/useSnackbar';
import useSelectedLedger from '../../../ledgers/hooks/useSelectedLedger';
import { useAccountsDispatch, useAccountsState } from '../AccountsContext';

// eslint-disable-next-line import/prefer-default-export
export function useCreateAccount() {
  const queryCache = useQueryCache();
  const snackbar = useSnackbar();
  const dispatch = useAccountsDispatch();
  const state = useAccountsState();
  const ledger = useSelectedLedger();

  const dialogOpen = state.showCreateAccount;
  const handleCloseDialog = () => dispatch({ type: 'hideCreateAccount' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to create account' });

  const [mutate] = useMutation(createAccount, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      queryCache.refetchQueries(['accountCategories', { ledger }]);
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
