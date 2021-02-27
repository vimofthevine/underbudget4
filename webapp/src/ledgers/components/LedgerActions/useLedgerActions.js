import useConfirmation from '../../../common/hooks/useConfirmation';
import useMobile from '../../../common/hooks/useMobile';
import useDeleteLedger from '../../hooks/useDeleteLedger';
import { useLedgersDispatch } from '../LedgersContext';

// eslint-disable-next-line import/prefer-default-export
export function useLedgerActions(ledger) {
  const mobile = useMobile();
  const confirm = useConfirmation();
  const dispatch = useLedgersDispatch();

  const handleModify = () =>
    dispatch({
      type: 'showModifyLedger',
      payload: ledger,
    });

  const { mutate } = useDeleteLedger();

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
