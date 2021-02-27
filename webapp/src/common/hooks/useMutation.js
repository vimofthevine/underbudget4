import { useMutation, useQueryClient } from 'react-query';
import useSnackbar from './useSnackbar';

export default (
  mutationFn,
  { createErrorMessage, onError, onSuccess, refetchQueries, ...mutationOpts },
) => {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();

  return useMutation(mutationFn, {
    ...mutationOpts,
    onError: (...args) => {
      if (createErrorMessage) {
        snackbar(createErrorMessage(...args));
      }
      if (onError) {
        onError(...args);
      }
    },

    onSuccess: (...args) => {
      const keys = typeof refetchQueries === 'function' ? refetchQueries(...args) : refetchQueries;

      if (Array.isArray(keys)) {
        keys.forEach((key) => queryClient.invalidateQueries(key));
      } else {
        queryClient.invalidateQueries(keys);
      }

      if (onSuccess) {
        onSuccess(...args);
      }
    },
  });
};
