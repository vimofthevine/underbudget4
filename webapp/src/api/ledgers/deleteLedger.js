import axios from 'axios';

import getAuthHeaders from '../../utils/getAuthHeaders';

export default (id) =>
  axios.delete(`/api/ledgers/${id}`, {
    headers: getAuthHeaders(),
  });
