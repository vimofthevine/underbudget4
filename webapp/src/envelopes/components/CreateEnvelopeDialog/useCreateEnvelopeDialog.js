import { useMutation } from 'react-query';

import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useSnackbar from '../../../common/hooks/useSnackbar';
import createEnvelope from '../../api/createEnvelope';
import { useEnvelopeDispatch, useEnvelopeState } from '../../contexts/envelope';
import useEnvelopesRefetch from '../../hooks/useEnvelopesRefetch';

export default function useCreateEnvelopeDialog() {
  const snackbar = useSnackbar();
  const dispatch = useEnvelopeDispatch();
  const state = useEnvelopeState();
  const refetch = useEnvelopesRefetch();

  const dialogOpen = state.showCreateEnvelope;
  const handleCloseDialog = () => dispatch({ type: 'hideCreateEnvelope' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to create envelope' });

  const [mutate] = useMutation(createEnvelope, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      refetch();
      handleCloseDialog();
    },
  });

  const handleCreate = ({ category, ...values }) =>
    mutate({ ...values, category: `/api/envelope-categories/${category}` });

  return {
    dialogOpen,
    handleCloseDialog,
    handleCreate,
  };
}
