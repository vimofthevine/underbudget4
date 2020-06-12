import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router';

import { accountRoute } from '../../../utils/routes';

const AccountListItem = ({ account }) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(accountRoute(account.id));

  return (
    <ListItem button onClick={handleClick}>
      <ListItemText inset primary={account.name} />
    </ListItem>
  );
};

AccountListItem.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default AccountListItem;
