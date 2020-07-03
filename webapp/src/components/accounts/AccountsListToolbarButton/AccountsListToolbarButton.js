import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';

import Menu from '../AccountsListMenu';

const AccountsListToolbarButton = () => {
  const [anchor, setAnchor] = React.useState(null);
  const handleOpen = (e) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);

  return (
    <>
      <IconButton
        aria-label='open accounts list menu'
        color='inherit'
        edge='end'
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu anchor={anchor} onClose={handleClose} />
    </>
  );
};

export default AccountsListToolbarButton;
