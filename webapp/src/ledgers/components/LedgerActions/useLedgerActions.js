import { useMutation, useQueryClient } from 'react-query';

import useConfirmation from '../../../common/hooks/useConfirmation';
import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useMobile from '../../../common/hooks/useMobile';
import useSnackbar from '../../../common/hooks/useSnackbar';
import deleteLedger from '../../api/deleteLedger';
import { useLedgersDispatch, useLedgersState } from '../LedgersContext';

// eslint-disable-next-line import/prefer-default-export
export function useLedgerActions(ledger) {
  const queryClient = useQueryClient();
  const mobile = useMobile();
  const confirm = useConfirmation();
  const snackbar = useSnackbar();
  const dispatch = useLedgersDispatch();
  const state = useLedgersState();

  const handleModify = () =>
    dispatch({
      type: 'showModifyLedger',
      payload: ledger,
    });

  const createErrorMessage = useErrorMessage({ request: 'Unable to delete ledger' });

  const { mutate } = useMutation(deleteLedger, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      queryClient.invalidateQueries('ledgers', state.pagination);
    },
  });

  const handleDelete = () =>
    confirm({
      message: [
        `Delete ledger ${ledger.name}?`,
        'This action is permanent and will delete all transaction data in this ledger.',
      ],
    }).then(() => {
      mutate(ledger.id);
    });

  return {
    handleDelete,
    handleModify,
    mobile,
  };
}
