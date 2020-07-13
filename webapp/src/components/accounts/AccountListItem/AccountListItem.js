import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router';

import { accountRoute } from '../../../common/utils/routes';

const useStyles = makeStyles((theme) => ({
  item: {
    paddingLeft: theme.spacing(4),
  },
}));

const AccountListItem = ({ account }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleClick = () => navigate(accountRoute(account.id));

  return (
    <ListItem button className={classes.item} onClick={handleClick}>
      <ListItemText primary={account.name} />
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
