import axios from 'axios';

import getAuthHeaders from '../../common/utils/getAuthHeaders';

export default (data) =>
  axios.post('/api/accounts', data, {
    headers: getAuthHeaders(),
  });
