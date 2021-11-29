import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
import React from 'react';

import useFormatMoney from 'common/hooks/useFormatMoney';
import TransactionIcon from './TransactionIcon';

const TransactionsList = ({ loading, onClick, transactions }) => {
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
          button={onClick !== null}
          key={transaction.id}
          onClick={onClick && (() => onClick(transaction))}
          role={undefined}
        >
          <ListItemIcon>
            <TransactionIcon type={transaction.type} />
          </ListItemIcon>
          <ListItemText
            primary={`${transaction.recordedDate} - ${transaction.payee}`}
            secondary={formatMoney(transaction.amount)}
          />
        </ListItem>
      ))}
    </List>
  );
};

TransactionsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      payee: PropTypes.string.isRequired,
      recordedDate: PropTypes.string.isRequired,
      type: TransactionIcon.propTypes.type,
    }),
  ).isRequired,
};

TransactionsList.defaultProps = {
  onClick: null,
};

export default TransactionsList;
