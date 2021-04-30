import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import PropTypes from 'prop-types';
import React from 'react';

import HistoryTransactionPropTypes from '../../utils/history-transaction-prop-types';
import TransactionDetailsTable from '../TransactionDetailsTable';

const FullTableHead = ({ hasCleared }) => (
  <TableHead>
    <TableRow>
      <TableCell style={{ width: '9em' }}>Date</TableCell>
      <TableCell>Payee</TableCell>
      <TableCell>Memo</TableCell>
      {hasCleared && <TableCell>Cleared</TableCell>}
      <TableCell style={{ width: '12em' }}>Amount</TableCell>
      <TableCell style={{ width: '12em' }}>Balance</TableCell>
    </TableRow>
  </TableHead>
);

FullTableHead.propTypes = {
  hasCleared: PropTypes.bool.isRequired,
};

const FullTableRow = ({ formatMoney, hasCleared, transaction }) => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => setOpen((old) => !old);
  return (
    <>
      <TableRow hover onClick={handleClick} style={{ cursor: 'pointer' }}>
        <TableCell>{transaction.recordedDate}</TableCell>
        <TableCell>{transaction.payee}</TableCell>
        <TableCell>{transaction.memo}</TableCell>
        {hasCleared && (
          <TableCell align='center'>
            {transaction.cleared && <CheckIcon style={{ fontSize: '0.9em' }} />}
          </TableCell>
        )}
        <TableCell>{formatMoney(transaction.amount)}</TableCell>
        <TableCell>{formatMoney(transaction.balance)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={hasCleared ? 6 : 5} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <Typography component='div' gutterBottom variant='h6'>
                Details
              </Typography>
              <TransactionDetailsTable formatMoney={formatMoney} id={transaction.transactionId} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

FullTableRow.propTypes = {
  formatMoney: PropTypes.func.isRequired,
  hasCleared: PropTypes.bool.isRequired,
  transaction: HistoryTransactionPropTypes.isRequired,
};

const FullTransactionsTable = ({ formatMoney, hasCleared, transactions }) => {
  return (
    <Table aria-label='transactions table' size='small' stickyHeader>
      <FullTableHead hasCleared={hasCleared} />
      <TableBody>
        {transactions.map((transaction) => (
          <FullTableRow
            key={transaction.id}
            formatMoney={formatMoney}
            hasCleared={hasCleared}
            transaction={transaction}
          />
        ))}
      </TableBody>
    </Table>
  );
};

FullTransactionsTable.propTypes = {
  formatMoney: PropTypes.func,
  hasCleared: PropTypes.bool,
  transactions: PropTypes.arrayOf(HistoryTransactionPropTypes),
};

FullTransactionsTable.defaultProps = {
  formatMoney: (v) => v,
  hasCleared: false,
  transactions: [],
};

export default FullTransactionsTable;
