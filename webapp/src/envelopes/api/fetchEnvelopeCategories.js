import axios from 'axios';

import getAuthHeaders from '../../common/utils/getAuthHeaders';

export default async (ledger) => {
  const { data } = await axios.get(
    `/api/ledgers/${ledger}/envelopeCategories?projection=categoryWithEnvelopes`,
    {
      headers: getAuthHeaders(),
    },
  );
  return data;
};
