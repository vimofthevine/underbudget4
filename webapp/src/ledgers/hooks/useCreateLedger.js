import axios from 'axios';
import useMutationWithRefetch from '../../common/hooks/useMutationWithRefetch';

export default (opts) =>
  useMutationWithRefetch((data) => axios.post('/api/ledgers', data), 'ledgers', opts);
