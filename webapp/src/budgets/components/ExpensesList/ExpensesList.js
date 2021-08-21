import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import React from 'react';

import useConfirmation from 'common/hooks/useConfirmation';
import useFormatMoney from 'common/hooks/useFormatMoney';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';

const ExpensesList = ({ expenses, onDelete, type }) => {
  const confirm = useConfirmation();
  const formatMoney = useFormatMoney();
  const navigate = useNavigateKeepingSearch();

  const handleDelete = (expense) =>
    confirm({
      message: [`Delete ${type} expense ${expense.name}?`],
    }).then(() => {
      onDelete(expense.id);
    });

  return (
    <List dense disablePadding>
      {expenses.map((expense) => (
        <ListItem button key={expense.id} onClick={() => navigate(`modify-${type}/${expense.id}`)}>
          <ListItemText
            primary={`${expense.envelope} - ${expense.name}`}
            secondary={formatMoney(expense.amount)}
          />
          <ListItemSecondaryAction>
            <IconButton aria-label='delete expense' onClick={() => handleDelete(expense)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

ExpensesList.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    }),
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['annual', 'periodic']).isRequired,
};

export default ExpensesList;
