import axios from 'axios';

import getAuthHeaders from '../../utils/getAuthHeaders';

export default ({ id, ...data }) =>
  axios.patch(`/api/accounts/${id}`, data, {
    headers: getAuthHeaders(),
  });
