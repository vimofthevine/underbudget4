import Checkbox from '@material-ui/core/Checkbox';
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

const SelectableTransactionsTable = ({
  loading,
  onSelect,
  onSelectAll,
  selected,
  transactions,
}) => {
  const formatMoney = useFormatMoney();
  const numSelected = React.useMemo(
    () => transactions.filter(({ id }) => selected.indexOf(id) !== -1).length,
    [selected, transactions],
  );

  return (
    <TableContainer>
      <Table aria-label='transactions table' size='small' stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox'>
              <Checkbox
                checked={transactions.length > 0 && numSelected === transactions.length}
                indeterminate={numSelected > 0 && numSelected < transactions.length}
                inputProps={{ 'aria-label': 'select all transactions' }}
                onChange={(e) => onSelectAll(e.target.checked, transactions)}
              />
            </TableCell>
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
              hover
              key={transaction.id}
              onClick={() => onSelect(transaction)}
              role='checkbox'
              selected={selected.indexOf(transaction.id) !== -1}
              style={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Checkbox checked={selected.indexOf(transaction.id) !== -1} />
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

SelectableTransactionsTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.number).isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      memo: PropTypes.string.isRequired,
      payee: PropTypes.string.isRequired,
      recordedDate: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default SelectableTransactionsTable;
