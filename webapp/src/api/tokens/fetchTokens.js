import axios from 'axios';

import getAuthHeaders from '../../utils/getAuthHeaders';

export default async () => {
  const { data } = await axios.get('/api/tokens', {
    headers: getAuthHeaders(),
  });
  return data;
};
