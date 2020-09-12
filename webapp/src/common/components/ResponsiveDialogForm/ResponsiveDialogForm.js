import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import useMobile from '../../hooks/useMobile';
import FullScreenDialogTitle from '../FullScreenDialogTitle';
import SubmitButton from '../SubmitButton';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const ResponsiveDialogForm = ({
  actionText,
  cancelText,
  disableFullScreen,
  FormComponent,
  onClose,
  open,
  title,
  ...props
}) => {
  const mobile = useMobile() && !disableFullScreen;

  return (
    <Dialog
      fullScreen={mobile}
      open={open}
      onClose={onClose}
      TransitionComponent={mobile ? Transition : undefined}
    >
      <Formik {...props}>
        <Form>
          {!mobile && <DialogTitle>{title}</DialogTitle>}
          {mobile && (
            <FullScreenDialogTitle actionText={actionText} onClose={onClose} title={title} />
          )}

          <DialogContent>
            <FormComponent />
          </DialogContent>

          {!mobile && (
            <DialogActions>
              <Button color='primary' onClick={onClose}>
                {cancelText}
              </Button>
              <SubmitButton fullWidth={false} style={{}} text={actionText} variant='text' />
            </DialogActions>
          )}
        </Form>
      </Formik>
    </Dialog>
  );
};

ResponsiveDialogForm.propTypes = {
  actionText: PropTypes.string.isRequired,
  cancelText: PropTypes.string,
  disableFullScreen: PropTypes.bool,
  FormComponent: PropTypes.elementType.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

ResponsiveDialogForm.defaultProps = {
  cancelText: 'Cancel',
  disableFullScreen: false,
};

export default ResponsiveDialogForm;
