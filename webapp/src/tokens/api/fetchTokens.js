import axios from 'axios';

import getAuthHeaders from '../../common/utils/getAuthHeaders';

export default async () => {
  const { data } = await axios.get('/api/tokens', {
    headers: getAuthHeaders(),
  });
  return data;
};
