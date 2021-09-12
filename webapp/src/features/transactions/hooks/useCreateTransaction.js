import axios from 'axios';
import toString from 'lodash/toString';
import moment from 'moment';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';
import useSelectedLedger from 'common/hooks/useSelectedLedger';

const formatDate = (date) => moment(date).format('YYYY-MM-DD');

export default (opts) => {
  const ledger = useSelectedLedger();
  return useMutation(
    ({ recordedDate, ...data }) =>
      axios.post(`/api/ledgers/${ledger}/transactions`, {
        recordedDate: formatDate(recordedDate),
        ...data,
      }),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to create transactions' }),
      refetchQueries: (_, { accountTransactions, envelopeTransactions }) => {
        const queries = [];
        accountTransactions.forEach((trn) => {
          queries.push(['account-balance', toString(trn.accountId)]);
          queries.push(['account-transactions', toString(trn.accountId)]);
          queries.push(['unreconciled-transactions', toString(trn.accountId)]);
        });
        envelopeTransactions.forEach((trn) => {
          queries.push(['envelope-balance', toString(trn.envelopeId)]);
          queries.push(['envelope-transactions', toString(trn.envelopeId)]);
        });
        return queries;
      },
      ...opts,
    },
  );
};
