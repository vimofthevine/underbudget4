import useModifyLedgerHook from '../../hooks/useModifyLedger';
import { useLedgersDispatch, useLedgersState } from '../LedgersContext';

const noLedger = {
  name: '',
  currency: 0,
};

// eslint-disable-next-line import/prefer-default-export
export function useModifyLedger() {
  const dispatch = useLedgersDispatch();
  const state = useLedgersState();

  const dialogOpen = state.ledgerToModify !== null;
  const handleCloseDialog = () => dispatch({ type: 'hideModifyLedger' });

  const { mutate } = useModifyLedgerHook({
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
