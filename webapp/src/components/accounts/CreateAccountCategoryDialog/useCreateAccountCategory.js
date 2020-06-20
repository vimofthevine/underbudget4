import { useMutation, useQueryCache } from 'react-query';

import createAccountCategory from '../../../api/accounts/createAccountCategory';
import useErrorMessage from '../../../hooks/useErrorMessage';
import useSelectedLedger from '../../../hooks/useSelectedLedger';
import { useSnackbar } from '../../common/SnackbarService';
import { useAccountsDispatch, useAccountsState } from '../AccountsContext';

// eslint-disable-next-line import/prefer-default-export
export function useCreateAccountCategory() {
  const queryCache = useQueryCache();
  const snackbar = useSnackbar();
  const dispatch = useAccountsDispatch();
  const state = useAccountsState();
  const ledger = useSelectedLedger();

  const dialogOpen = state.showCreateAccountCategory;
  const handleCloseDialog = () => dispatch({ type: 'hideCreateAccountCategory' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to create account category' });

  const [mutate] = useMutation(createAccountCategory, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      queryCache.refetchQueries(['accountCategories', { ledger }]);
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
