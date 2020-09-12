import axios from 'axios';

import getAuthHeaders from '../../common/utils/getAuthHeaders';

export default (data) =>
  axios.post('/api/account-categories', data, {
    headers: getAuthHeaders(),
  });
