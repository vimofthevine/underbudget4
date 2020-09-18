import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';

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
      name='category'
      variant='outlined'
    />
  </>
);

export default EnvelopeForm;
