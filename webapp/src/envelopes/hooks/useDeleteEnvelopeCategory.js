import { useMutation } from 'react-query';

import useConfirmation from '../../common/hooks/useConfirmation';
import useErrorMessage from '../../common/hooks/useErrorMessage';
import useSnackbar from '../../common/hooks/useSnackbar';
import deleteEnvelopeCategory from '../api/deleteEnvelopeCategory';
import useEnvelopesRefetch from './useEnvelopesRefetch';

export default function useDeleteEnvelopeCategory(category) {
  const confirm = useConfirmation();
  const snackbar = useSnackbar();
  const refetch = useEnvelopesRefetch();

  const createErrorMessage = useErrorMessage({ request: 'Unable to delete envelope category' });

  const [mutate] = useMutation(deleteEnvelopeCategory, {
    onError: (err) => snackbar(createErrorMessage(err)),
    onSuccess: refetch,
  });

  return () =>
    confirm({
      message: [
        `Delete envelope category ${category.name}?`,
        'This action is permanent and cannot be undone.',
      ],
    }).then(() => {
      mutate(category.id);
    });
}
