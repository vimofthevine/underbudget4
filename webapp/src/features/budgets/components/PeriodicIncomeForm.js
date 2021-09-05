import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import * as yup from 'yup';

import MoneyInputField from 'common/components/MoneyInputField';

const PeriodicIncomeForm = () => (
  <>
    <Field
      autoComplete='off'
      autoFocus
      component={TextField}
      fullWidth
      id='income-name'
      label='Name'
      margin='normal'
      name='name'
      placeholder='Income name'
      required
      variant='outlined'
    />
    <Field
      component={MoneyInputField}
      fullWidth
      id='income-amount'
      label='Amount'
      margin='normal'
      name='amount'
      required
      variant='outlined'
    />
  </>
);

PeriodicIncomeForm.initialValues = {
  name: '',
  amount: 0,
};

PeriodicIncomeForm.validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  amount: yup.number().typeError('Required').min(1, 'Must be a positive amount'),
});

export default PeriodicIncomeForm;
