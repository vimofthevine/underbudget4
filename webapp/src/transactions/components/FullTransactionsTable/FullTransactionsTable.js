import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import React from 'react';

import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import HistoryTransactionPropTypes from '../../utils/history-transaction-prop-types';
import TransactionDetailsTable from '../TransactionDetailsTable';
import TransactionIcon from '../TransactionIcon';

const FullTableHead = ({ hasCleared }) => (
  <TableHead>
    <TableRow>
      <TableCell style={{ width: '0.5em' }} />
      <TableCell style={{ width: '9em' }}>Date</TableCell>
      <TableCell>Payee</TableCell>
      <TableCell>Memo</TableCell>
      {hasCleared && <TableCell>Cleared</TableCell>}
      <TableCell style={{ width: '10em' }}>Amount</TableCell>
      <TableCell style={{ width: '10em' }}>Balance</TableCell>
      <TableCell />
    </TableRow>
  </TableHead>
);

FullTableHead.propTypes = {
  hasCleared: PropTypes.bool.isRequired,
};

const FullTableRow = ({ formatMoney, hasCleared, transaction }) => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => setOpen((old) => !old);

  const navigate = useNavigateKeepingSearch();
  const handleModify = () => navigate(`modify-transaction/${transaction.transactionId}`);

  return (
    <>
      <TableRow hover onClick={handleClick} style={{ cursor: 'pointer' }}>
        <TableCell padding='checkbox'>
          <TransactionIcon type={transaction.type} />
        </TableCell>
        <TableCell>{transaction.recordedDate}</TableCell>
        <TableCell>{transaction.payee}</TableCell>
        <TableCell>{transaction.memo}</TableCell>
        {hasCleared && (
          <TableCell aria-label={transaction.cleared ? 'cleared' : 'uncleared'} padding='checkbox'>
            {transaction.cleared && <CheckIcon />}
          </TableCell>
        )}
        <TableCell>{formatMoney(transaction.amount)}</TableCell>
        <TableCell>{formatMoney(transaction.balance)}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()} padding='checkbox'>
          <IconButton aria-label='modify transaction' onClick={handleModify}>
            <EditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={hasCleared ? 7 : 6} style={{ paddingBottom: 0, paddingTop: 0 }}>
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
    <TableContainer>
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
    </TableContainer>
  );
};

FullTransactionsTable.propTypes = {
  formatMoney: PropTypes.func.isRequired,
  hasCleared: PropTypes.bool,
  transactions: PropTypes.arrayOf(HistoryTransactionPropTypes),
};

FullTransactionsTable.defaultProps = {
  hasCleared: false,
  transactions: [],
};

export default FullTransactionsTable;
