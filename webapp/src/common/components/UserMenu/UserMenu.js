import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { LOGOUT, TOKENS } from '../../utils/routes';

const UserAccountMenu = ({ anchor, onClose }) => {
  const navigate = useNavigate();
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
      <MenuItem onClick={() => navigate(TOKENS)}>Access Tokens</MenuItem>
      <MenuItem onClick={() => navigate(LOGOUT)}>Logout</MenuItem>
    </Menu>
  );
};

UserAccountMenu.propTypes = {
  anchor: PropTypes.shape({}),
  onClose: PropTypes.func.isRequired,
};

UserAccountMenu.defaultProps = {
  anchor: null,
};

export default UserAccountMenu;
