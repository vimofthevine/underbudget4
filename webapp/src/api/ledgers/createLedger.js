import axios from 'axios';

import getAuthHeaders from '../../utils/getAuthHeaders';

export default (data) =>
  axios.post('/api/ledgers', data, {
    headers: getAuthHeaders(),
  });
