import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import groupBy from 'lodash/groupBy';
import PropTypes from 'prop-types';
import React from 'react';

import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import HistoryTransactionPropTypes from '../../utils/history-transaction-prop-types';

const MobileTableRow = ({ formatMoney, transaction }) => {
  const navigate = useNavigateKeepingSearch();
  const handleClick = () => navigate(`transaction/${transaction.transactionId}`);

  return (
    <>
      <TableRow onClick={handleClick}>
        <TableCell style={{ paddingLeft: '2em' }}>{transaction.payee}</TableCell>
        <TableCell>{formatMoney(transaction.amount)}</TableCell>
      </TableRow>
    </>
  );
};

MobileTableRow.propTypes = {
  formatMoney: PropTypes.func.isRequired,
  transaction: HistoryTransactionPropTypes.isRequired,
};

const MobileTransactionsTable = ({ formatMoney, transactions }) => {
  const byDate = React.useMemo(() => groupBy(transactions, 'recordedDate'), [transactions]);
  return (
    <TableContainer>
      <Table aria-label='transactions table' size='small' stickyHeader>
        <TableBody>
          {Object.keys(byDate).map((recordedDate) => (
            <React.Fragment key={recordedDate}>
              <TableRow>
                <TableCell colSpan={2}>{recordedDate}</TableCell>
              </TableRow>
              {byDate[recordedDate].map((transaction) => (
                <MobileTableRow
                  key={transaction.id}
                  formatMoney={formatMoney}
                  transaction={transaction}
                />
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

MobileTransactionsTable.propTypes = {
  formatMoney: PropTypes.func.isRequired,
  transactions: PropTypes.arrayOf(HistoryTransactionPropTypes),
};

MobileTransactionsTable.defaultProps = {
  transactions: [],
};

export default MobileTransactionsTable;
