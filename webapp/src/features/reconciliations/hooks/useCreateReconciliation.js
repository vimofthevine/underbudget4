import axios from 'axios';
import moment from 'moment';

import useErrorMessage from 'common/hooks/useErrorMessage';
import useMutation from 'common/hooks/useMutation';

const formatDate = (date) => moment(date).format('YYYY-MM-DD');

export default ({ accountId, ...opts }) => {
  return useMutation(
    ({ beginningDate, endingDate, reconciledBalance, reconciledBalanceDiff, ...data }) =>
      axios.post(`/api/accounts/${accountId}/reconciliations`, {
        beginningDate: formatDate(beginningDate),
        endingDate: formatDate(endingDate),
        ...data,
      }),
    {
      createErrorMessage: useErrorMessage({ request: 'Unable to create reconciliation' }),
      refetchQueries: [['reconciliations', { accountId }]],
      ...opts,
    },
  );
};
