import { useNavigate } from 'react-router-dom';

import useConfirmation from '../../../common/hooks/useConfirmation';
import useMobile from '../../../common/hooks/useMobile';
import useDeleteLedger from '../../hooks/useDeleteLedger';

// eslint-disable-next-line import/prefer-default-export
export function useLedgerActions(ledger) {
  const navigate = useNavigate();
  const mobile = useMobile();
  const confirm = useConfirmation();

  const handleModify = () => navigate(`modify/${ledger.id}`);

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
