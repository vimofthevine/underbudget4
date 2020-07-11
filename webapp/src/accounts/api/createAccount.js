import axios from 'axios';

import getAuthHeaders from '../../utils/getAuthHeaders';

export default (data) =>
  axios.post('/api/accounts', data, {
    headers: getAuthHeaders(),
  });
