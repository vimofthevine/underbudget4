import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import * as yup from 'yup';

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

EnvelopeCategoryForm.initialValues = {
  name: '',
};

EnvelopeCategoryForm.validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
});

export default EnvelopeCategoryForm;
