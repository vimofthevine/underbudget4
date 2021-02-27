import { Field, Formik } from 'formik';
import React from 'react';

import NumberInputField from './NumberInputField';

export default {
  title: 'common/NumberInputField',
  component: NumberInputField,
};

export const DefaultProps = () => (
  <Formik initialValues={{ field: 0 }}>
    <>
      <Field name='field' component={NumberInputField} />
    </>
  </Formik>
);

export const TextFieldProps = () => (
  <Formik initialValues={{ field: 0 }}>
    <>
      <Field name='field' component={NumberInputField} helperText='A number' label='Number' />
    </>
  </Formik>
);

export const Formatted = () => (
  <Formik initialValues={{ field: 123456.789 }}>
    <>
      <Field
        name='field'
        component={NumberInputField}
        numberInputProps={{ decimalScale: 2, prefix: '>', suffix: 'ft', thousandSeparator: true }}
      />
      <Field name='field' />
    </>
  </Formik>
);

export const FormError = () => (
  <Formik
    initialErrors={{ field: 'number is bad' }}
    initialTouched={{ field: true }}
    initialValues={{ field: 0 }}
  >
    <>
      <Field name='field' component={NumberInputField} helperText='help text' />
    </>
  </Formik>
);
