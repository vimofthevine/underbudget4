import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import groupBy from 'lodash/groupBy';
import PropTypes from 'prop-types';
import React from 'react';

import HistoryTransactionPropTypes from '../../utils/history-transaction-prop-types';

const MobileTableRow = ({ formatMoney, hasCleared, transaction }) => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => setOpen((old) => !old);
  return (
    <>
      <TableRow onClick={handleClick}>
        <TableCell style={{ paddingLeft: '2em' }}>{transaction.payee}</TableCell>
        <TableCell>{formatMoney(transaction.amount)}</TableCell>
      </TableRow>
      <Collapse in={open} unmountOnExit>
        <TableRow>
          <TableCell colSpan={2}>details {hasCleared}</TableCell>
        </TableRow>
      </Collapse>
    </>
  );
};

MobileTableRow.propTypes = {
  formatMoney: PropTypes.func.isRequired,
  hasCleared: PropTypes.bool.isRequired,
  transaction: HistoryTransactionPropTypes.isRequired,
};

const MobileTransactionsTable = ({ formatMoney, hasCleared, transactions }) => {
  const byDate = React.useMemo(() => groupBy(transactions, 'recordedDate'), [transactions]);
  return (
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
                hasCleared={hasCleared}
                transaction={transaction}
              />
            ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

MobileTransactionsTable.propTypes = {
  formatMoney: PropTypes.func,
  hasCleared: PropTypes.bool,
  transactions: PropTypes.arrayOf(HistoryTransactionPropTypes),
};

MobileTransactionsTable.defaultProps = {
  formatMoney: (v) => v,
  hasCleared: false,
  transactions: [],
};

export default MobileTransactionsTable;
