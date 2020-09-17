import { useMutation } from 'react-query';

import useConfirmation from '../../common/hooks/useConfirmation';
import useErrorMessage from '../../common/hooks/useErrorMessage';
import useSnackbar from '../../common/hooks/useSnackbar';
import deleteEnvelope from '../api/deleteEnvelope';
import useEnvelopesRefetch from './useEnvelopesRefetch';

export default function useDeleteEnvelope(envelope) {
  const confirm = useConfirmation();
  const snackbar = useSnackbar();
  const refetch = useEnvelopesRefetch();

  const createErrorMessage = useErrorMessage({ request: 'Unable to delete envelope' });

  const [mutate] = useMutation(deleteEnvelope, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: refetch,
  });

  return () =>
    confirm({
      message: [
        `Delete envelope ${envelope.name}?`,
        'This action is permanent and cannot be undone.',
      ],
    }).then(() => {
      mutate(envelope.id);
    });
}
