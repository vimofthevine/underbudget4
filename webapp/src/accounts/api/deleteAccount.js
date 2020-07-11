import axios from 'axios';

import getAuthHeaders from '../../utils/getAuthHeaders';

export default (id) =>
  axios.delete(`/api/accounts/${id}`, {
    headers: getAuthHeaders(),
  });
