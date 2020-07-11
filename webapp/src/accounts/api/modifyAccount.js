import axios from 'axios';

import getAuthHeaders from '../../common/utils/getAuthHeaders';

export default ({ id, ...data }) =>
  axios.patch(`/api/accounts/${id}`, data, {
    headers: getAuthHeaders(),
  });
