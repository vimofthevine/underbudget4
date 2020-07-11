import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React from 'react';

import UserMenu from '../UserMenu';

const UserToolbarButton = () => {
  const [anchor, setAnchor] = React.useState(null);
  const handleOpen = (e) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);

  return (
    <>
      <IconButton aria-label='open account menu' color='inherit' edge='end' onClick={handleOpen}>
        <AccountCircleIcon />
      </IconButton>
      <UserMenu anchor={anchor} onClose={handleClose} />
    </>
  );
};

export default UserToolbarButton;
