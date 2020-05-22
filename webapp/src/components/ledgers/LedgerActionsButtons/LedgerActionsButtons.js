import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import React from 'react';

const LedgerActionsButtons = ({ onDelete, onModify }) => (
  <>
    <Tooltip title='Modify ledger'>
      <IconButton onClick={onModify}>
        <EditIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title='Delete ledger'>
      <IconButton onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  </>
);

LedgerActionsButtons.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onModify: PropTypes.func.isRequired,
};

export default LedgerActionsButtons;
