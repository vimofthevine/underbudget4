import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router';

import { accountRoute } from '../../../common/utils/routes';
import AccountPropTypes from '../../utils/account-prop-types';
import AccountActionsButton from '../AccountActionsButton';

const useStyles = makeStyles((theme) => ({
  item: {
    paddingLeft: theme.spacing(4),
  },
}));

const AccountListItem = ({ account, dense }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleClick = () => navigate(accountRoute(account.id));

  return (
    <ListItem button className={classes.item} dense={dense} onClick={handleClick}>
      <ListItemText inset primary={account.name} />
      <ListItemSecondaryAction>
        <AccountActionsButton account={account} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

AccountListItem.propTypes = {
  account: AccountPropTypes.isRequired,
  dense: PropTypes.bool.isRequired,
};

export default AccountListItem;
