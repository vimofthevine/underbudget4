import { action } from '@storybook/addon-actions';
import { Field } from 'formik';
import React from 'react';

import ResponsiveDialogForm from './ResponsiveDialogForm';

const Form = () => <Field name='fieldName' />;

export default {
  title: 'common/ResponsiveDialogForm',
  component: ResponsiveDialogForm,
};

export const Desktop = () => (
  <ResponsiveDialogForm
    actionText='Apply'
    formikProps={{
      initialValues: { fieldName: 'field value' },
      onSubmit: action('submit'),
    }}
    FormComponent={Form}
    onClose={action('close')}
    open
    title='Dialog Title'
  />
);

export const Mobile = () => (
  <ResponsiveDialogForm
    actionText='Apply'
    formikProps={{
      initialValues: { fieldName: 'field value' },
      onSubmit: action('submit'),
    }}
    FormComponent={Form}
    onClose={action('close')}
    open
    title='Dialog Title'
  />
);

Mobile.story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
