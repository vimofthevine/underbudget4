import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React from 'react';

import { useAccountsDispatch } from '../AccountsContext';

const AccountsListMenu = ({ anchor, onClose }) => {
  const dispatch = useAccountsDispatch();
  const handleAddAccount = () => {
    onClose();
    dispatch({ type: 'showCreateAccount' });
  };
  const handleAddAccountCategory = () => {
    onClose();
    dispatch({ type: 'showCreateAccountCategory' });
  };

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
