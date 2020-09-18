import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';

const EnvelopeCategoryForm = () => (
  <Field
    autoComplete='off'
    autoFocus
    component={TextField}
    id='envelope-category-name'
    fullWidth
    label='Name'
    margin='normal'
    name='name'
    placeholder='My envelopes'
    required
    variant='outlined'
  />
);

export default EnvelopeCategoryForm;
