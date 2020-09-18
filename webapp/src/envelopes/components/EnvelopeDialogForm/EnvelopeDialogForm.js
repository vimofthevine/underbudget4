import PropTypes from 'prop-types';
import React from 'react';
import * as yup from 'yup';

import ResponsiveDialogForm from '../../../common/components/ResponsiveDialogForm';
import EnvelopeForm from '../EnvelopeForm';

const validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  category: yup.string().required('Required'),
});

const EnvelopeDialogForm = ({ actionText, initialValues, onClose, onSubmit, open, title }) => (
  <ResponsiveDialogForm
    actionText={actionText}
    FormComponent={EnvelopeForm}
    initialValues={initialValues}
    onClose={onClose}
    onSubmit={onSubmit}
    open={open}
    title={title}
    validationSchema={validationSchema}
  />
);

EnvelopeDialogForm.propTypes = {
  actionText: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    category: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default EnvelopeDialogForm;
