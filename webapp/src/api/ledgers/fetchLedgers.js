import axios from 'axios';

import getAuthHeaders from '../../utils/getAuthHeaders';

export default async (key, { page, size }) => {
  const { data } = await axios.get(`/api/ledgers?page=${page}&size=${size}`, {
    headers: getAuthHeaders(),
  });
  return data;
};
