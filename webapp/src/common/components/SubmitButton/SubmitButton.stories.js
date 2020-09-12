import { action } from '@storybook/addon-actions';
import { Form, Formik } from 'formik';
import React from 'react';

import SubmitButton from './SubmitButton';

export default {
  title: 'common/SubmitButton',
  components: SubmitButton,
};

export const Disabled = () => (
  <Formik initialValues={{}} onSubmit={action('submit')}>
    <Form>
      <SubmitButton text='Click me' disabled />
    </Form>
  </Formik>
);

export const Enabled = () => (
  <Formik initialValues={{}} onSubmit={action('submit')}>
    <Form>
      <SubmitButton text='Click me' />
    </Form>
  </Formik>
);
