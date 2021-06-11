import axios from 'axios';
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
          queries.push(['account-balance', trn.accountId]);
          queries.push(['account-transactions', trn.accountId]);
        });
        envelopeTransactions.forEach((trn) => {
          queries.push(['envelope-balance', trn.envelopeId]);
          queries.push(['envelope-transactions', trn.envelopeId]);
        });
        return queries;
      },
      ...opts,
    },
  );
};
