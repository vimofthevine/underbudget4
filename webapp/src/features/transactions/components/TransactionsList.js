import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import useFormatMoney from 'common/hooks/useFormatMoney';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import TransactionDetailsDialog from './TransactionDetailsDialog';
import TransactionIcon from './TransactionIcon';

const TransactionsList = ({ loading, onClick, showDetailsOnClick, transactions }) => {
  const formatMoney = useFormatMoney();
  const navigate = useNavigateKeepingSearch();

  let handleClick = null;
  if (onClick) {
    handleClick = onClick;
  } else if (showDetailsOnClick) {
    handleClick = ({ transactionId }) => navigate(`transaction/${transactionId}`);
  }

  return (
    <>
      <List dense disablePadding>
        {loading && (
          <ListItem>
            <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
          </ListItem>
        )}
        {transactions.map((transaction) => (
          <ListItem
            button={handleClick !== null}
            key={transaction.id}
            onClick={handleClick && (() => handleClick(transaction))}
            role={handleClick ? 'button' : undefined}
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
      <Routes>
        <Route
          path='transaction/:transactionId/*'
          element={<TransactionDetailsDialog onExitNavigateTo='../..' />}
        />
      </Routes>
    </>
  );
};

TransactionsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  showDetailsOnClick: PropTypes.bool,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      payee: PropTypes.string.isRequired,
      recordedDate: PropTypes.string.isRequired,
      transactionId: PropTypes.number.isRequired,
      type: TransactionIcon.propTypes.type,
    }),
  ).isRequired,
};

TransactionsList.defaultProps = {
  onClick: null,
  showDetailsOnClick: true,
};

export default TransactionsList;
