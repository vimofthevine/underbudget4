import axios from 'axios';
import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

export default (opts) =>
  useMutation((id) => axios.delete(`/api/ledgers/${id}`), {
    createErrorMessage: useErrorMessage({ request: 'Unable to delete ledger' }),
    refetchQueries: 'ledgers',
    ...opts,
  });
