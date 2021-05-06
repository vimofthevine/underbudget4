import axios from 'axios';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { useQuery } from 'react-query';

import useErrorMessage from '../../common/hooks/useErrorMessage';
import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';

export default function useEnvelopes({ sorted = true } = {}) {
  const ledger = useSelectedLedger();

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve envelopes' });

  const { data, error, status } = useQuery(
    ['envelope-categories', { ledger }],
    async () => {
      const { data: resp } = await axios.get(`/api/ledgers/${ledger}/envelope-categories`);
      return resp;
    },
    { enabled: !!ledger },
  );

  const categories = React.useMemo(() => {
    if (!data) {
      return [];
    }
    if (!sorted) {
      return data.categories;
    }
    return sortBy(data.categories, ['name']).map((c) => ({
      ...c,
      envelopes: sortBy(c.envelopes, ['name']),
    }));
  }, [data, sorted]);

  return {
    categories,
    error: createErrorMessage(error),
    status,
  };
}
