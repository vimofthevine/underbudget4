import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['envelope', id],
    async () => {
      const { data } = await axios.get(`/api/envelopes/${id}`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
