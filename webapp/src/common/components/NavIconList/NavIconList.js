import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountIcon from '@material-ui/icons/AccountBalance';
import BookIcon from '@material-ui/icons/Book';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LogoutIcon from '@material-ui/icons/Lock';
import ReportIcon from '@material-ui/icons/InsertChart';
import EnvelopeIcon from '@material-ui/icons/Mail';
import BudgetIcon from '@material-ui/icons/MonetizationOn';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import * as routes from '../../utils/routes';

const NavIconList = () => {
  const navigate = useNavigate();

  return (
    <>
      <List>
        <ListItem button onClick={() => navigate(routes.DASHBOARD)}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem button onClick={() => navigate(routes.LEDGERS)}>
          <ListItemIcon>
            <BookIcon />
          </ListItemIcon>
          <ListItemText primary='Ledgers' />
        </ListItem>
        <ListItem button onClick={() => navigate(routes.ACCOUNTS)}>
          <ListItemIcon>
            <AccountIcon />
          </ListItemIcon>
          <ListItemText primary='Accounts' />
        </ListItem>
        <ListItem button onClick={() => navigate(routes.ENVELOPES)}>
          <ListItemIcon>
            <EnvelopeIcon />
          </ListItemIcon>
          <ListItemText primary='Envelopes' />
        </ListItem>
        <ListItem button onClick={() => navigate(routes.BUDGETS)}>
          <ListItemIcon>
            <BudgetIcon />
          </ListItemIcon>
          <ListItemText primary='Budgets' />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem button onClick={() => navigate(routes.REPORTS)}>
          <ListItemIcon>
            <ReportIcon />
          </ListItemIcon>
          <ListItemText primary='Reports' />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem button component='a' href={routes.LOGOUT}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </ListItem>
      </List>
    </>
  );
};

export default NavIconList;
