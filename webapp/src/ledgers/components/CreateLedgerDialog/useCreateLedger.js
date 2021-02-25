import { useMutation, useQueryClient } from 'react-query';

import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useSnackbar from '../../../common/hooks/useSnackbar';
import createLedger from '../../api/createLedger';
import { useLedgersDispatch, useLedgersState } from '../LedgersContext';

// eslint-disable-next-line import/prefer-default-export
export function useCreateLedger() {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  const dispatch = useLedgersDispatch();
  const state = useLedgersState();

  const dialogOpen = state.showCreateLedger;
  const handleCloseDialog = () => dispatch({ type: 'hideCreateLedger' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to create ledger' });

  const { mutate } = useMutation(createLedger, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      queryClient.invalidateQueries('ledgers', state.pagination);
      handleCloseDialog();
    },
  });

  return {
    dialogOpen,
    handleCloseDialog,
    handleCreate: mutate,
  };
}
