import { useMutation } from 'react-query';

import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useSnackbar from '../../../common/hooks/useSnackbar';
import useSelectedLedger from '../../../ledgers/hooks/useSelectedLedger';
import createEnvelopeCategory from '../../api/createEnvelopeCategory';
import { useEnvelopeDispatch, useEnvelopeState } from '../../contexts/envelope';
import useEnvelopesRefetch from '../../hooks/useEnvelopesRefetch';

export default function useCreateEnvelopeCategoryDialog() {
  const snackbar = useSnackbar();
  const dispatch = useEnvelopeDispatch();
  const state = useEnvelopeState();
  const ledger = useSelectedLedger();
  const refetch = useEnvelopesRefetch();

  const dialogOpen = state.showCreateEnvelopeCategory;
  const handleCloseDialog = () => dispatch({ type: 'hideCreateEnvelopeCategory' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to create envelope category' });

  const { mutate } = useMutation(createEnvelopeCategory, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      refetch();
      handleCloseDialog();
    },
  });

  const handleCreate = (values) => mutate({ ...values, ledger: `/api/ledgers/${ledger}` });

  return {
    dialogOpen,
    handleCloseDialog,
    handleCreate,
  };
}
