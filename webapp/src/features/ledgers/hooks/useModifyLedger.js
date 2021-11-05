import axios from 'axios';
import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

export default (opts) =>
  useMutation(({ created, id, lastUpdated, ...data }) => axios.put(`/api/ledgers/${id}`, data), {
    createErrorMessage: useErrorMessage({ request: 'Unable to modify ledger' }),
    refetchQueries: (_, { id }) => ['ledgers', ['ledger', id]],
    ...opts,
  });
