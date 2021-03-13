import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Form, Formik, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import useConfirm from '../../hooks/useConfirmation';
import useMobile from '../../hooks/useMobile';
import FullScreenDialogTitle from '../FullScreenDialogTitle';
import SubmitButton from '../SubmitButton';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const Dirty = ({ onChange }) => {
  const { dirty } = useFormikContext();
  React.useEffect(() => onChange(dirty), [dirty]);
  return null;
};

/**
 * This dialog is opinionated about how it should work. It expects to be mounted
 * through a matched route, and will navigate away from that route in order to
 * close the dialog.
 */
const FormDialog = ({
  actionText,
  cancelConfirmText,
  cancelText,
  disableFullScreen,
  FormComponent,
  onExitNavigateTo,
  onSubmit,
  title,
  ...props
}) => {
  const confirm = useConfirm();
  const mobile = useMobile() && !disableFullScreen;
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = React.useState(true);
  const dirtyRef = React.useRef(false);

  const handleDirty = (dirty) => {
    dirtyRef.current = dirty;
  };
  const handleClose = () => {
    if (dirtyRef.current) {
      if (mobile) {
        confirm({
          confirmText: 'Yes',
          message: cancelConfirmText,
          rejectText: 'No',
          title: 'Cancel?',
        }).then(() => setIsOpen(false));
      } else if (window.confirm(cancelConfirmText)) {
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  };
  const handleExited = () => navigate(onExitNavigateTo);

  // Set some additional callbacks to allow for cleaning up the form/dialog
  const handleSubmit = (values, { resetForm, setSubmitting, ...formikBag }) =>
    onSubmit(values, {
      onSettled: () => setSubmitting(false),
      onSuccess: () => {
        resetForm();
        handleClose();
      },
      resetForm,
      setSubmitting,
      ...formikBag,
    });

  return (
    <Dialog
      fullScreen={mobile}
      open={isOpen}
      onClose={handleClose}
      onExited={handleExited}
      TransitionComponent={mobile ? Transition : undefined}
    >
      <Formik onSubmit={handleSubmit} {...props}>
        <Form>
          <Dirty onChange={handleDirty} />

          {!mobile && <DialogTitle>{title}</DialogTitle>}
          {mobile && (
            <FullScreenDialogTitle actionText={actionText} onClose={handleClose} title={title} />
          )}

          <DialogContent>
            <FormComponent />
          </DialogContent>

          {!mobile && (
            <DialogActions>
              <Button color='primary' onClick={handleClose}>
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

FormDialog.propTypes = {
  actionText: PropTypes.string.isRequired,
  cancelConfirmText: PropTypes.string,
  cancelText: PropTypes.string,
  disableFullScreen: PropTypes.bool,
  FormComponent: PropTypes.elementType.isRequired,
  onExitNavigateTo: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

FormDialog.defaultProps = {
  cancelConfirmText: 'You have unsaved changes. Are you sure you wish to cancel?',
  cancelText: 'Cancel',
  disableFullScreen: false,
  onExitNavigateTo: '../',
};

export default FormDialog;
