import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ accountId, endingDate, enabled = true, ...opts }) =>
  useQuery(
    ['cleared-transactions', accountId, endingDate],
    async () => {
      const { data } = await axios.get(
        `/api/account-transactions/search?accountId=${accountId}&recordedDate=lte:${endingDate}&reconciliationId=is:null&cleared=True&size=10000`,
      );
      return data;
    },
    { enabled: enabled && !!accountId && !!endingDate, ...opts },
  );
