import axios from 'axios';

import getAuthHeaders from '../../utils/getAuthHeaders';

export default (data) =>
  axios.post('/api/account-categories', data, {
    headers: getAuthHeaders(),
  });
