import { queryCache, useMutation } from 'react-query';

import createLedger from '../../../api/ledgers/createLedger';
import useErrorMessage from '../../../hooks/useErrorMessage';
import { useSnackbar } from '../../common/SnackbarService';
import { useLedgersDispatch, useLedgersState } from '../LedgersContext';

// eslint-disable-next-line import/prefer-default-export
export function useCreateLedger() {
  const snackbar = useSnackbar();
  const dispatch = useLedgersDispatch();
  const state = useLedgersState();

  const dialogOpen = state.showCreateLedger;
  const handleCloseDialog = () => dispatch({ type: 'hideCreateLedger' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to create ledger' });

  const [handleCreate] = useMutation(createLedger, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      queryCache.refetchQueries('ledgers', state.pagination);
      handleCloseDialog();
    },
  });

  return {
    dialogOpen,
    handleCloseDialog,
    handleCreate,
  };
}
