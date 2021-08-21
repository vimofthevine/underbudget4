import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import * as yup from 'yup';

import MoneyInputField from 'common/components/MoneyInputField';
import EnvelopeSelectField from 'envelopes/components/EnvelopeSelectField';

const PeriodicExpenseForm = () => (
  <>
    <Field
      autoComplete='off'
      autoFocus
      component={TextField}
      fullWidth
      id='expense-name'
      label='Name'
      margin='normal'
      name='name'
      placeholder='Expense name'
      required
      variant='outlined'
    />
    <Field
      component={EnvelopeSelectField}
      fullWidth
      id='expense-envelope-id'
      label='Envelope'
      margin='normal'
      name='envelopeId'
      required
      variant='outlined'
    />
    <Field
      component={MoneyInputField}
      fullWidth
      id='expense-amount'
      label='Amount'
      margin='normal'
      name='amount'
      required
      variant='outlined'
    />
  </>
);

PeriodicExpenseForm.initialValues = {
  name: '',
  envelopeId: 0,
  amount: 0,
};

PeriodicExpenseForm.validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  envelopeId: yup.number().min(1, 'Required').required('Required'),
  amount: yup.number().typeError('Required').min(1, 'Must be a positive amount'),
});

export default PeriodicExpenseForm;
