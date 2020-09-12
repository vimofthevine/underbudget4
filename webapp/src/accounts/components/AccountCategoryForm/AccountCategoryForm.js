import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';

const AccountCategoryForm = () => (
  <Field
    autoComplete='off'
    autoFocus
    component={TextField}
    id='account-category-name'
    fullWidth
    label='Name'
    margin='normal'
    name='name'
    placeholder='My accounts'
    required
    variant='outlined'
  />
);

export default AccountCategoryForm;
