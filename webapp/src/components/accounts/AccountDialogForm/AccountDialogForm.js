import PropTypes from 'prop-types';
import React from 'react';
import * as yup from 'yup';

import ResponsiveDialogForm from '../../../common/components/ResponsiveDialogForm';
import AccountForm from '../AccountForm';

const validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  category: yup.string().required('Required'),
});

const AccountDialogForm = ({ actionText, initialValues, onClose, onSubmit, open, title }) => (
  <ResponsiveDialogForm
    actionText={actionText}
    formikProps={{
      initialValues,
      onSubmit,
      validationSchema,
    }}
    FormComponent={AccountForm}
    onClose={onClose}
    open={open}
    title={title}
  />
);

AccountDialogForm.propTypes = {
  actionText: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    accountNumber: PropTypes.string,
    category: PropTypes.string.isRequired,
    institution: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default AccountDialogForm;
