import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useSnackbar from '../../../common/hooks/useSnackbar';
import useCreateLedgerHook from '../../hooks/useCreateLedger';
import { useLedgersDispatch, useLedgersState } from '../LedgersContext';

// eslint-disable-next-line import/prefer-default-export
export function useCreateLedger() {
  const snackbar = useSnackbar();
  const dispatch = useLedgersDispatch();
  const state = useLedgersState();

  const dialogOpen = state.showCreateLedger;
  const handleCloseDialog = () => dispatch({ type: 'hideCreateLedger' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to create ledger' });

  const { mutate } = useCreateLedgerHook({
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: handleCloseDialog,
  });

  return {
    dialogOpen,
    handleCloseDialog,
    handleCreate: mutate,
  };
}
