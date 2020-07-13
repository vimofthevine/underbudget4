import currency from 'currency-codes';
import PropTypes from 'prop-types';
import React from 'react';
import * as yup from 'yup';

import ResponsiveDialogForm from '../../../common/components/ResponsiveDialogForm';
import LedgerForm from '../LedgerForm';

const validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  currency: yup
    .number()
    .oneOf(
      currency.numbers().map((n) => Number(n)),
      'Must be a valid currency',
    )
    .required('Required'),
});

const LedgerDialogForm = ({ actionText, initialValues, onClose, onSubmit, open, title }) => (
  <ResponsiveDialogForm
    actionText={actionText}
    formikProps={{
      initialValues,
      onSubmit,
      validationSchema,
    }}
    FormComponent={LedgerForm}
    onClose={onClose}
    open={open}
    title={title}
  />
);

LedgerDialogForm.propTypes = {
  actionText: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
    currency: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default LedgerDialogForm;
