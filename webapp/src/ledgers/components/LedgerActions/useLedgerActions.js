import useConfirmation from '../../../common/hooks/useConfirmation';
import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useMobile from '../../../common/hooks/useMobile';
import useSnackbar from '../../../common/hooks/useSnackbar';
import useDeleteLedger from '../../hooks/useDeleteLedger';
import { useLedgersDispatch } from '../LedgersContext';

// eslint-disable-next-line import/prefer-default-export
export function useLedgerActions(ledger) {
  const mobile = useMobile();
  const confirm = useConfirmation();
  const snackbar = useSnackbar();
  const dispatch = useLedgersDispatch();

  const handleModify = () =>
    dispatch({
      type: 'showModifyLedger',
      payload: ledger,
    });

  const createErrorMessage = useErrorMessage({ request: 'Unable to delete ledger' });

  const { mutate } = useDeleteLedger({
    onError: (err) => snackbar(createErrorMessage(err)),
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
