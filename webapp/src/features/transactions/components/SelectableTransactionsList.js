import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
import React from 'react';

import useFormatMoney from 'common/hooks/useFormatMoney';

const SelectableTransactionsList = ({ loading, onSelect, selected, transactions }) => {
  const formatMoney = useFormatMoney();
  return (
    <List dense disablePadding>
      {loading && (
        <ListItem>
          <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
        </ListItem>
      )}
      {transactions.map((transaction) => (
        <ListItem
          button
          key={transaction.id}
          onClick={() => onSelect(transaction)}
          role={undefined}
        >
          <ListItemIcon>
            <Checkbox
              checked={selected.indexOf(transaction.id) !== -1}
              disableRipple
              edge='start'
              inputProps={{ 'aria-labelledby': `transaction-select-${transaction.id}` }}
            />
          </ListItemIcon>
          <ListItemText
            id={`transaction-select-${transaction.id}`}
            primary={`${transaction.recordedDate} - ${transaction.payee}`}
            secondary={formatMoney(transaction.amount)}
          />
        </ListItem>
      ))}
    </List>
  );
};

SelectableTransactionsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.number).isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      payee: PropTypes.string.isRequired,
      recordedDate: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default SelectableTransactionsList;
