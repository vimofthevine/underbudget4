import { useMutation } from 'react-query';

import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useSnackbar from '../../../common/hooks/useSnackbar';
import modifyEnvelopeCategory from '../../api/modifyEnvelopeCategory';
import { useEnvelopeDispatch, useEnvelopeState } from '../../contexts/envelope';
import useEnvelopesRefetch from '../../hooks/useEnvelopesRefetch';

const noCategory = {
  name: '',
};

export default function useCreateEnvelopeCategory() {
  const snackbar = useSnackbar();
  const dispatch = useEnvelopeDispatch();
  const state = useEnvelopeState();
  const refetch = useEnvelopesRefetch();

  const dialogOpen = state.envelopeCategoryToModify !== null;
  const handleCloseDialog = () => dispatch({ type: 'hideModifyEnvelopeCategory' });

  const createErrorMessage = useErrorMessage({ request: 'Unable to modify envelope category' });

  const [mutate] = useMutation(modifyEnvelopeCategory, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: () => {
      refetch();
      handleCloseDialog();
    },
  });
  const handleModify = (values) =>
    mutate({
      ...values,
      envelopes: undefined,
    });

  const category = state.envelopeCategoryToModify || noCategory;

  return {
    category,
    dialogOpen,
    handleCloseDialog,
    handleModify,
  };
}
