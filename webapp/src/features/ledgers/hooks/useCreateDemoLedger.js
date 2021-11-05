import axios from 'axios';
import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

export default (opts) =>
  useMutation((data) => axios.post('/api/demos', data), {
    createErrorMessage: useErrorMessage({ request: 'Unable to create demo ledger' }),
    refetchQueries: 'ledgers',
    ...opts,
  });
