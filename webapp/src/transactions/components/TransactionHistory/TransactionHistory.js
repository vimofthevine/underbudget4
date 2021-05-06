import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

import TablePagination from '../../../common/components/TablePagination';
import useErrorMessage from '../../../common/hooks/useErrorMessage';
import useMobile from '../../../common/hooks/useMobile';
import scrollToTop from '../../../common/utils/scrollToTop';
import useFormatMoney from '../../../ledgers/hooks/useFormatMoney';
import FullTransactionsTable from '../FullTransactionsTable';
import MobileTransactionsTable from '../MobileTransactionsTable';

const TransactionHistory = ({ hasCleared, useFetchTransactions }) => {
  const mobile = useMobile();
  const formatMoney = useFormatMoney();
  const { id } = useParams();

  const defaultSize = 25;

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve transactions' });
  const { data, error, isError, isFetching, isLoading } = useFetchTransactions({ defaultSize, id });
  const errorMessage = createErrorMessage(error);
  const count = data ? data.total : 0;
  const transactions = data ? data.transactions : [];

  React.useEffect(() => {
    if (!isFetching) {
      scrollToTop();
    }
  }, [isFetching]);

  const TableComponent = mobile ? MobileTransactionsTable : FullTransactionsTable;

  return (
    <>
      <TableComponent
        formatMoney={formatMoney}
        hasCleared={hasCleared}
        transactions={transactions}
      />
      {(isLoading || isFetching) && <LinearProgress />}
      {isError && <Alert severity='error'>{errorMessage}</Alert>}
      <TablePagination
        count={count}
        defaultSize={defaultSize}
        labelRowsPerPage='Transactions per page'
      />
    </>
  );
};

TransactionHistory.propTypes = {
  hasCleared: PropTypes.bool,
  useFetchTransactions: PropTypes.func.isRequired,
};

TransactionHistory.defaultProps = {
  hasCleared: false,
};

export default TransactionHistory;
