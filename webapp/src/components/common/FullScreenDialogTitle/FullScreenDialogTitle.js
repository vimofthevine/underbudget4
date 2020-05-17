import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

const FullScreenDialogTitle = ({ actionText, onClose, title }) => {
  const { isSubmitting, isValid } = useFormikContext();
  return (
    <AppBar style={{ position: 'relative' }}>
      <Toolbar>
        <IconButton aria-label='close' color='inherit' onClick={onClose}>
          <CloseIcon />
        </IconButton>

        <Typography color='inherit' style={{ flex: 1 }} variant='h6'>
          {title}
        </Typography>

        <Button color='inherit' disabled={isSubmitting || !isValid} type='submit'>
          {actionText}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

FullScreenDialogTitle.propTypes = {
  actionText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default FullScreenDialogTitle;
