// Disable rule because this is a generic component
/* eslint-disable react/jsx-props-no-spreading */

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import useMobile from '../../../hooks/useMobile';
import FullScreenDialogTitle from '../FullScreenDialogTitle';
import SubmitButton from '../SubmitButton';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const ResponsiveDialogForm = ({
  actionText,
  cancelText,
  formikProps,
  FormComponent,
  onClose,
  open,
  title,
}) => {
  const mobile = useMobile();

  return (
    <Dialog
      fullScreen={mobile}
      open={open}
      onClose={onClose}
      TransitionComponent={mobile ? Transition : undefined}
    >
      <Formik {...formikProps}>
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
  formikProps: PropTypes.shape({}),
  FormComponent: PropTypes.elementType.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

ResponsiveDialogForm.defaultProps = {
  cancelText: 'Cancel',
  formikProps: null,
};

export default ResponsiveDialogForm;