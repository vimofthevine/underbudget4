import axios from 'axios';
import { useQuery } from 'react-query';

export default ({ id }, opts) =>
  useQuery(
    ['envelope-category', id],
    async () => {
      const { data } = await axios.get(`/api/envelope-categories/${id}`);
      return data;
    },
    { enabled: !!id, ...opts },
  );
