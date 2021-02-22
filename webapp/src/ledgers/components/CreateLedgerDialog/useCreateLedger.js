import { useMutation, useQueryCache } from 'react-query';

import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useSnackbar from '../../../common/hooks/useSnackbar';
import createLedger from '../../api/createLedger';
import { useLedgersDispatch, useLedgersState } from '../LedgersContext';

// eslint-disable-next-line import/prefer-default-export
export function useCreateLedger() {
  const queryCache = useQueryCache();
  const snackbar = useSnackbar();
  const dispatch = useLedgersDispatch();
  const state = useLedgersState();

  const dialogOpen = state.showCreateLedger;
  const handleCloseDialog = () => dispatch({ type: 'hideCreateLedger' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to create ledger' });

  const [handleCreate] = useMutation(createLedger, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      queryCache.invalidateQueries('ledgers', state.pagination);
      handleCloseDialog();
    },
  });

  return {
    dialogOpen,
    handleCloseDialog,
    handleCreate,
  };
}
