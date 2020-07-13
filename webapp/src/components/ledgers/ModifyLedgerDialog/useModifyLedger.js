import { useMutation, useQueryCache } from 'react-query';

import modifyLedger from '../../../api/ledgers/modifyLedger';
import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useSnackbar from '../../../common/hooks/useSnackbar';
import { useLedgersDispatch, useLedgersState } from '../LedgersContext';

const noLedger = {
  name: '',
  currency: 0,
};

// eslint-disable-next-line import/prefer-default-export
export function useModifyLedger() {
  const queryCache = useQueryCache();
  const snackbar = useSnackbar();
  const dispatch = useLedgersDispatch();
  const state = useLedgersState();

  const dialogOpen = state.ledgerToModify !== null;
  const handleCloseDialog = () => dispatch({ type: 'hideModifyLedger' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to modify ledger' });

  const [handleModify] = useMutation(modifyLedger, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      queryCache.refetchQueries('ledgers', state.pagination);
      handleCloseDialog();
    },
  });

  const ledger = state.ledgerToModify || noLedger;

  return {
    dialogOpen,
    handleCloseDialog,
    handleModify,
    ledger,
  };
}
