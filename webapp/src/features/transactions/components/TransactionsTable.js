import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
import React from 'react';

import useFormatMoney from 'common/hooks/useFormatMoney';
import TransactionDetailsTable from './TransactionDetailsTable';
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

const TransactionsTable = ({ loading, onClick, showDetailsOnClick, transactions }) => {
  const [detailsTrnId, setDetailsTrnId] = React.useState(null);
  const formatMoney = useFormatMoney();

  let handleClick = null;
  if (onClick) {
    handleClick = onClick;
  } else if (showDetailsOnClick) {
    handleClick = ({ id }) => setDetailsTrnId((old) => (old === id ? null : id));
  }

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
            <>
              <TableRow
                hover={handleClick !== null}
                key={transaction.id}
                onClick={handleClick && (() => handleClick(transaction))}
                role={handleClick ? 'checkbox' : 'row'}
                style={handleClick && { cursor: 'pointer' }}
              >
                <TableCell>
                  <TransactionIcon type={transaction.type} />
                </TableCell>
                <TableCell>{transaction.recordedDate}</TableCell>
                <TableCell>{transaction.payee}</TableCell>
                <TableCell>{transaction.memo}</TableCell>
                <TableCell>{formatMoney(transaction.amount)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Collapse in={transaction.id === detailsTrnId} timeout='auto' unmountonExit>
                    <Typography component='div' gutterBottom variant='h6'>
                      Details
                    </Typography>
                    <TransactionDetailsTable
                      formatMoney={formatMoney}
                      id={transaction.transactionId}
                    />
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TransactionsTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  showDetailsOnClick: PropTypes.bool,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      memo: PropTypes.string.isRequired,
      payee: PropTypes.string.isRequired,
      recordedDate: PropTypes.string.isRequired,
      transactionId: PropTypes.number.isRequired,
      type: TransactionIcon.propTypes.type,
    }),
  ).isRequired,
};

TransactionsTable.defaultProps = {
  onClick: null,
  showDetailsOnClick: true,
};

export default TransactionsTable;
