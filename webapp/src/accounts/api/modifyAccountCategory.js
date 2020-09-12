import axios from 'axios';

import getAuthHeaders from '../../common/utils/getAuthHeaders';

export default ({ id, ...data }) =>
  axios.patch(`/api/account-categories/${id}`, data, {
    headers: getAuthHeaders(),
  });
