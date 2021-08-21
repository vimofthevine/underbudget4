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

const IncomesList = ({ incomes, onDelete, type }) => {
  const confirm = useConfirmation();
  const formatMoney = useFormatMoney();
  const navigate = useNavigateKeepingSearch();

  const handleDelete = (income) =>
    confirm({
      message: [`Delete ${type} income ${income.name}?`],
    }).then(() => {
      onDelete(income.id);
    });

  return (
    <List dense disablePadding>
      {incomes.map((income) => (
        <ListItem button key={income.id} onClick={() => navigate(`modify-${type}/${income.id}`)}>
          <ListItemText primary={income.name} secondary={formatMoney(income.amount)} />
          <ListItemSecondaryAction>
            <IconButton aria-label='delete income' onClick={() => handleDelete(income)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

IncomesList.propTypes = {
  incomes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    }),
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['annual', 'periodic']).isRequired,
};

export default IncomesList;
