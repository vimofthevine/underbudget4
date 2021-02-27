import axios from 'axios';
import useMutationWithRefetch from '../../common/hooks/useMutationWithRefetch';

export default (opts) =>
  useMutationWithRefetch((id) => axios.delete(`/api/ledgers/${id}`), 'ledgers', opts);
