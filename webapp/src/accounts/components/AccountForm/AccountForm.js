import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';

import AccountCategorySelectField from '../AccountCategorySelectField';

const AccountForm = () => (
  <>
    <Field
      autoComplete='off'
      autoFocus
      component={TextField}
      fullWidth
      id='account-name'
      label='Name'
      margin='normal'
      name='name'
      placeholder='My account'
      required
      variant='outlined'
    />
    <Field
      component={AccountCategorySelectField}
      id='account-category'
      label='Category'
      name='category'
      variant='outlined'
    />
    <Field
      component={TextField}
      fullWidth
      id='account-institution'
      label='Institution Name'
      margin='normal'
      name='institution'
      placeholder='e.g., bank name'
      variant='outlined'
    />
    <Field
      autoComplete='off'
      component={TextField}
      fullWidth
      id='account-number'
      label='Account Number'
      margin='normal'
      name='accountNumber'
      variant='outlined'
    />
  </>
);

export default AccountForm;
