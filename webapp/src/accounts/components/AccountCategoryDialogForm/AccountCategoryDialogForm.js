import PropTypes from 'prop-types';
import React from 'react';
import * as yup from 'yup';

import ResponsiveDialogForm from '../../../common/components/ResponsiveDialogForm';
import AccountCategoryForm from '../AccountCategoryForm';

const validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
});

const AccountCategoryDialogForm = ({
  actionText,
  initialValues,
  onClose,
  onSubmit,
  open,
  title,
}) => (
  <ResponsiveDialogForm
    actionText={actionText}
    disableFullScreen
    formikProps={{
      initialValues,
      onSubmit,
      validationSchema,
    }}
    FormComponent={AccountCategoryForm}
    onClose={onClose}
    open={open}
    title={title}
  />
);

AccountCategoryDialogForm.propTypes = {
  actionText: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default AccountCategoryDialogForm;
