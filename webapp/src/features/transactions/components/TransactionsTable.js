import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
import React from 'react';

import useFormatMoney from 'common/hooks/useFormatMoney';
import TransactionIcon from './TransactionIcon';

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton />
    </TableCell>
    <TableCell>
      <Skeleton />
    </TableCell>
    <TableCell>
      <Skeleton />
    </TableCell>
    <TableCell>
      <Skeleton />
    </TableCell>
    <TableCell>
      <Skeleton />
    </TableCell>
  </TableRow>
);

const TransactionsTable = ({ loading, onClick, transactions }) => {
  const formatMoney = useFormatMoney();

  return (
    <TableContainer>
      <Table aria-label='transactions table' size='small' stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox' />
            <TableCell style={{ width: '9em' }}>Date</TableCell>
            <TableCell>Payee</TableCell>
            <TableCell>Memo</TableCell>
            <TableCell style={{ width: '10em' }}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && <SkeletonRow />}
          {transactions.map((transaction) => (
            <TableRow
              hover={onClick !== null}
              key={transaction.id}
              onClick={onClick && (() => onClick(transaction))}
              role='checkbox'
              style={onClick && { cursor: 'pointer' }}
            >
              <TableCell>
                <TransactionIcon type={transaction.type} />
              </TableCell>
              <TableCell>{transaction.recordedDate}</TableCell>
              <TableCell>{transaction.payee}</TableCell>
              <TableCell>{transaction.memo}</TableCell>
              <TableCell>{formatMoney(transaction.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TransactionsTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      memo: PropTypes.string.isRequired,
      payee: PropTypes.string.isRequired,
      recordedDate: PropTypes.string.isRequired,
      type: TransactionIcon.propTypes.type,
    }),
  ).isRequired,
};

TransactionsTable.defaultProps = {
  onClick: null,
};

export default TransactionsTable;
