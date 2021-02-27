import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useSnackbar from '../../../common/hooks/useSnackbar';
import useModifyLedgerHook from '../../hooks/useModifyLedger';
import { useLedgersDispatch, useLedgersState } from '../LedgersContext';

const noLedger = {
  name: '',
  currency: 0,
};

// eslint-disable-next-line import/prefer-default-export
export function useModifyLedger() {
  const snackbar = useSnackbar();
  const dispatch = useLedgersDispatch();
  const state = useLedgersState();

  const dialogOpen = state.ledgerToModify !== null;
  const handleCloseDialog = () => dispatch({ type: 'hideModifyLedger' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to modify ledger' });

  const { mutate } = useModifyLedgerHook({
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: handleCloseDialog,
  });

  const ledger = state.ledgerToModify || noLedger;

  return {
    dialogOpen,
    handleCloseDialog,
    handleModify: mutate,
    ledger,
  };
}
