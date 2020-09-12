import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import React from 'react';

const LedgerActionsMenu = ({ onDelete, onModify }) => {
  const [anchor, setAnchor] = React.useState(null);
  const handleOpen = (e) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);

  const handleModify = () => {
    handleClose();
    onModify();
  };

  const handleDelete = () => {
    handleClose();
    onDelete();
  };

  return (
    <>
      <IconButton aria-label='Open ledger actions menu' onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchor} onClose={handleClose} open={Boolean(anchor)}>
        <MenuItem onClick={handleModify}>Modify ledger</MenuItem>
        <MenuItem onClick={handleDelete}>Delete ledger</MenuItem>
      </Menu>
    </>
  );
};

LedgerActionsMenu.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onModify: PropTypes.func.isRequired,
};

export default LedgerActionsMenu;
