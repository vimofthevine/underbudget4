import sortBy from 'lodash/sortBy';
import React from 'react';
import { useQuery } from 'react-query';

import useErrorMessage from '../../common/hooks/useErrorMessage';
import useSelectedLedger from '../../ledgers/hooks/useSelectedLedger';
import fetchEnvelopeCategories from '../api/fetchEnvelopeCategories';

export default function useEnvelopes() {
  const ledger = useSelectedLedger();

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve envelopes' });

  const { data, error, status } = useQuery(
    ledger && ['envelopeCategories', { ledger }],
    fetchEnvelopeCategories,
  );
  const unsorted = data ? data._embedded.envelopeCategories : [];

  const categories = React.useMemo(
    () =>
      sortBy(unsorted, ['name']).map((c) => ({
        ...c,
        envelopes: sortBy(c.envelopes, ['name']),
      })),
    [unsorted],
  );

  return {
    categories,
    error: createErrorMessage(error),
    status,
  };
}
