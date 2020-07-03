import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router';

import { ACCOUNT_CATEGORIES } from '../../../utils/routes';
import { useAccountsDispatch } from '../AccountsContext';

const AccountsListMenu = ({ anchor, onClose }) => {
  const dispatch = useAccountsDispatch();
  const navigate = useNavigate();

  const handleAddAccount = () => {
    onClose();
    dispatch({ type: 'showCreateAccount' });
  };
  const handleAddAccountCategory = () => {
    onClose();
    dispatch({ type: 'showCreateAccountCategory' });
  };
  const handleEditCategories = () => navigate(ACCOUNT_CATEGORIES);

  return (
    <Menu
      anchorEl={anchor}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      onClose={onClose}
      open={Boolean(anchor)}
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
    >
      <MenuItem onClick={handleAddAccount}>Add Account</MenuItem>
      <MenuItem onClick={handleAddAccountCategory}>Add Category</MenuItem>
      <Divider />
      <MenuItem onClick={handleEditCategories}>Edit Categories</MenuItem>
    </Menu>
  );
};

AccountsListMenu.propTypes = {
  anchor: PropTypes.shape({}),
  onClose: PropTypes.func.isRequired,
};

AccountsListMenu.defaultProps = {
  anchor: null,
};

export default AccountsListMenu;
