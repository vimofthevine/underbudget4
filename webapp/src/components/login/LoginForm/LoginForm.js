import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import * as yup from 'yup';

import SubmitButton from '../../common/SubmitButton';

const schema = yup.object().shape({
  password: yup.string().required('Required'),
});

const LoginForm = ({ onLogin }) => (
  <Formik
    initialValues={{ password: '' }}
    onSubmit={onLogin}
    validateOnBlur={false}
    validationSchema={schema}
  >
    {({ isSubmitting, isValid }) => (
      <Form>
        <Field
          autoComplete='current-password'
          component={TextField}
          fullWidth
          id='password'
          label='Password'
          name='password'
          type='password'
        />
        <SubmitButton disabled={isSubmitting || !isValid} text='Login' />
      </Form>
    )}
  </Formik>
);

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
