import axios from 'axios';

import getAuthHeaders from '../../common/utils/getAuthHeaders';

export default ({ id, ...data }) =>
  axios.put(`/api/ledgers/${id}`, data, {
    headers: getAuthHeaders(),
  });
