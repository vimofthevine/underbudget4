import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';

const ConfirmationDialog = ({
  confirmText,
  message,
  onConfirm,
  onReject,
  open,
  rejectText,
  title,
}) => (
  <Dialog
    aria-labelledby='confirmation-dialog'
    disableBackdropClick
    disableEscapeKeyDown
    maxWidth='xs'
    open={open}
  >
    <DialogTitle id='confirmation-dialog-title'>{title}</DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button autoFocus color='primary' onClick={onReject}>
        {rejectText}
      </Button>
      <Button color='primary' onClick={onConfirm}>
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

ConfirmationDialog.propTypes = {
  confirmText: PropTypes.string,
  message: PropTypes.string,
  onConfirm: PropTypes.func,
  onReject: PropTypes.func,
  open: PropTypes.bool,
  rejectText: PropTypes.string,
  title: PropTypes.string,
};

ConfirmationDialog.defaultProps = {
  confirmText: 'OK',
  message: 'Are you sure?',
  onConfirm: () => 0,
  onReject: () => 0,
  open: false,
  rejectText: 'Cancel',
  title: 'Confirm',
};

export default ConfirmationDialog;
