import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';

import CurrencyInputField from './CurrencyInputField';

export default {
  title: 'common/CurrencyInputField',
  component: CurrencyInputField,
};

export const DefaultProps = () => (
  <Formik initialValues={{ field: 840 }}>
    <>
      <Field name='field' component={CurrencyInputField} />
      <Field name='field' component={TextField} />
    </>
  </Formik>
);

export const AutoCompleteProps = () => (
  <Formik initialValues={{ field: 980 }}>
    <>
      <Field
        autoCompleteProps={{ style: { background: 'lightgreen' } }}
        name='field'
        component={CurrencyInputField}
      />
      <Field name='field' component={TextField} />
    </>
  </Formik>
);

export const TextFieldProps = () => (
  <Formik initialValues={{ field: 840 }}>
    <>
      <Field
        name='field'
        component={CurrencyInputField}
        helperText='Currency type'
        label='Currency'
      />
      <Field name='field' component={TextField} />
    </>
  </Formik>
);

export const FormError = () => (
  <Formik initialValues={{ field: 840 }} validate={() => ({ field: 'field is bad' })}>
    <>
      <Field name='field' component={CurrencyInputField} helperText='help text' />
      <Field name='field' component={TextField} />
    </>
  </Formik>
);
