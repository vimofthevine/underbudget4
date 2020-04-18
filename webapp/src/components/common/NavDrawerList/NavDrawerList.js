import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountIcon from '@material-ui/icons/AccountBalance';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LedgerIcon from '@material-ui/icons/Folder';
import ReportIcon from '@material-ui/icons/InsertChart';
import EnvelopeIcon from '@material-ui/icons/Mail';
import IncomeIcon from '@material-ui/icons/MonetizationOn';
import ExpenseIcon from '@material-ui/icons/ShoppingCart';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import * as routes from '../../../utils/routes';
import AccountDrawerList from '../AccountDrawerList';

const NavDrawerList = ({ showAccountItems }) => {
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
        <ListItem button onClick={() => navigate(routes.LEDGERS)}>
          <ListItemIcon>
            <LedgerIcon />
          </ListItemIcon>
          <ListItemText primary='Ledgers' />
        </ListItem>
      </List>

      <Divider />

      <List>
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
        <ListItem button onClick={() => navigate(routes.INCOMES)}>
          <ListItemIcon>
            <IncomeIcon />
          </ListItemIcon>
          <ListItemText primary='Incomes' />
        </ListItem>
        <ListItem button onClick={() => navigate(routes.EXPENSES)}>
          <ListItemIcon>
            <ExpenseIcon />
          </ListItemIcon>
          <ListItemText primary='Expenses' />
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
      {showAccountItems && (
        <>
          <Divider />
          <AccountDrawerList />
        </>
      )}
    </>
  );
};

NavDrawerList.propTypes = {
  showAccountItems: PropTypes.bool,
};

NavDrawerList.defaultProps = {
  showAccountItems: false,
};

export default NavDrawerList;
