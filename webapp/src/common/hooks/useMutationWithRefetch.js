import { useMutation, useQueryClient } from 'react-query';

export default (mutationFn, refetchKeys, { onSuccess, ...mutationOpts } = {}) => {
  const queryClient = useQueryClient();
  return useMutation(mutationFn, {
    ...mutationOpts,
    onSuccess: (...args) => {
      const keys = typeof refetchKeys === 'function' ? refetchKeys(...args) : refetchKeys;

      if (Array.isArray(refetchKeys)) {
        keys.forEach(queryClient.invalidateQueries);
      } else {
        queryClient.invalidateQueries(keys);
      }

      if (onSuccess) {
        onSuccess(...args);
      }
    },
  });
};
