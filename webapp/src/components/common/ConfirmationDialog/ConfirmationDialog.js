import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
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
  variant,
}) => (
  <Dialog
    aria-labelledby='confirmation-dialog-title'
    disableBackdropClick
    disableEscapeKeyDown
    maxWidth='xs'
    open={open}
  >
    <DialogTitle id='confirmation-dialog-title'>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      {variant !== 'info' && (
        <Button autoFocus color='primary' onClick={onReject}>
          {rejectText}
        </Button>
      )}
      <Button color='primary' onClick={onConfirm}>
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

ConfirmationDialog.propTypes = {
  confirmText: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onConfirm: PropTypes.func,
  onReject: PropTypes.func,
  open: PropTypes.bool,
  rejectText: PropTypes.string,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['confirm', 'info']),
};

ConfirmationDialog.defaultProps = {
  confirmText: 'OK',
  message: 'Are you sure?',
  onConfirm: () => 0,
  onReject: () => 0,
  open: false,
  rejectText: 'Cancel',
  title: 'Confirm',
  variant: 'confirm',
};

export default ConfirmationDialog;
