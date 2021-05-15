import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { DatePicker, KeyboardDatePicker } from 'formik-material-ui-pickers';
import React from 'react';
import * as yup from 'yup';

import useMobile from 'common/hooks/useMobile';

const TransactionForm = () => (
  <>
    <Field
      autoComplete='off'
      autoFocus
      component={TextField}
      fullWidth
      id='payee'
      label='Payee'
      margin='normal'
      name='payee'
      placeholder='Transaction payee'
      required
      variant='outlined'
    />
    <Field
      autoOk
      component={useMobile() ? DatePicker : KeyboardDatePicker}
      format='yyyy-MM-DD'
      fullWidth
      id='recorded-date'
      inputVariant='outlined'
      label='Date'
      name='recordedDate'
    />
  </>
);

TransactionForm.initialValues = {
  payee: '',
  recordedDate: new Date(),
};

TransactionForm.validationSchema = yup.object().shape({
  payee: yup.string().required('Required'),
  recordedDate: yup.date().required('Required'),
});

export default TransactionForm;
