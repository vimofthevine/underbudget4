import axios from 'axios';
import keyBy from 'lodash/keyBy';
import toString from 'lodash/toString';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

const formatDate = (date) => moment(date).format('YYYY-MM-DD');

const createSplitsPatch = (updated, original) => {
  const add = updated.filter((i) => !i.id);
  const modify = updated.filter((i) => i.id);

  const byId = keyBy(modify, 'id');
  const del = original.filter((i) => !byId[i.id]).map((i) => i.id);

  return { add, modify, delete: del };
};

const createPatch = (updated, original) => {
  const { accountTransactions, envelopeTransactions, payee, recordedDate, type } = updated;
  return {
    accountTransactions: createSplitsPatch(accountTransactions, original.accountTransactions),
    envelopeTransactions: createSplitsPatch(envelopeTransactions, original.envelopeTransactions),
    recordedDate: formatDate(recordedDate),
    payee,
    type,
  };
};

export default (opts) => {
  return useMutation(
    ([{ created, id, lastUpdated, ...data }, initialValues]) =>
      axios.patch(`/api/transactions/${id}`, createPatch(data, initialValues)),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to modify transaction' }),
      refetchQueries: (_, [updated, original]) => {
        const accountTransactions = uniqBy(
          updated.accountTransactions.concat(original.accountTransactions),
          'accountId',
        );
        const envelopeTransactions = uniqBy(
          updated.envelopeTransactions.concat(original.envelopeTransactions),
          'envelopeId',
        );

        const queries = [];
        accountTransactions.forEach((trn) => {
          queries.push(['account-balance', toString(trn.accountId)]);
          queries.push(['account-transactions', toString(trn.accountId)]);
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
