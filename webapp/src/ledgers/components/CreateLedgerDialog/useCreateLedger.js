import useCreateLedgerHook from '../../hooks/useCreateLedger';
import { useLedgersDispatch, useLedgersState } from '../LedgersContext';

// eslint-disable-next-line import/prefer-default-export
export function useCreateLedger() {
  const dispatch = useLedgersDispatch();
  const state = useLedgersState();

  const dialogOpen = state.showCreateLedger;
  const handleCloseDialog = () => dispatch({ type: 'hideCreateLedger' });

  const { mutate } = useCreateLedgerHook({
    onSuccess: handleCloseDialog,
  });

  return {
    dialogOpen,
    handleCloseDialog,
    handleCreate: mutate,
  };
}
