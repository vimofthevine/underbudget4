import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import * as yup from 'yup';

import EnvelopeCategorySelectField from '../EnvelopeCategorySelectField';

const EnvelopeForm = () => (
  <>
    <Field
      autoComplete='off'
      autoFocus
      component={TextField}
      fullWidth
      id='envelope-name'
      label='Name'
      margin='normal'
      name='name'
      placeholder='My envelope'
      required
      variant='outlined'
    />
    <Field
      component={EnvelopeCategorySelectField}
      id='envelope-category'
      label='Category'
      name='categoryId'
      variant='outlined'
    />
  </>
);

EnvelopeForm.initialValues = {
  name: '',
  categoryId: 0,
};

EnvelopeForm.validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  categoryId: yup.number().min(1, 'Required'),
});

export default EnvelopeForm;
