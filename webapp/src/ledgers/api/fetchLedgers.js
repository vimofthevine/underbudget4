import axios from 'axios';

import getAuthHeaders from '../../common/utils/getAuthHeaders';

export default async ({ page, size }) => {
  const { data } = await axios.get(`/api/ledgers?page=${page}&size=${size}`, {
    headers: getAuthHeaders(),
  });
  return data;
};
