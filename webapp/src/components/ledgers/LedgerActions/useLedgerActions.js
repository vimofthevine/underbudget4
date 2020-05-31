import { queryCache, useMutation } from 'react-query';

import deleteLedger from '../../../api/ledgers/deleteLedger';
import useErrorMessage from '../../../hooks/useErrorMessage';
import useMobile from '../../../hooks/useMobile';
import { useConfirmation } from '../../common/ConfirmationService';
import { useSnackbar } from '../../common/SnackbarService';
import { useLedgersDispatch, useLedgersState } from '../LedgersContext';

// eslint-disable-next-line import/prefer-default-export
export function useLedgerActions(ledger) {
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

  const [mutate] = useMutation(deleteLedger, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      queryCache.refetchQueries('ledgers', state.pagination);
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
