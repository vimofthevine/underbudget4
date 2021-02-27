import axios from 'axios';
import useMutationWithRefetch from '../../common/hooks/useMutationWithRefetch';

export default (opts) =>
  useMutationWithRefetch(
    ({ id, ...data }) => axios.put(`/api/ledgers/${id}`, data),
    (_, { id }) => ['ledgers', ['ledger', id]],
    opts,
  );
