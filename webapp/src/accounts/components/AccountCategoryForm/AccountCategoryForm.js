import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import * as yup from 'yup';

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

AccountCategoryForm.validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
});

export default AccountCategoryForm;
