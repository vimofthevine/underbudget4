import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import TokenIcon from '@material-ui/icons/VpnKey';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import * as routes from '../../../utils/routes';

const AccountDrawerList = () => {
  const navigate = useNavigate();
  return (
    <List>
      <ListItem button onClick={() => navigate(routes.TOKENS)}>
        <ListItemIcon>
          <TokenIcon />
        </ListItemIcon>
        <ListItemText primary='Access Tokens' />
      </ListItem>
      <ListItem button onClick={() => navigate(routes.LOGOUT)}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary='Logout' />
      </ListItem>
    </List>
  );
};

export default AccountDrawerList;
