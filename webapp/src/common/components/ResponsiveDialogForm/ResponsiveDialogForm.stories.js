import { action } from '@storybook/addon-actions';
import { Field } from 'formik';
import React from 'react';

import ResponsiveDialogForm from './ResponsiveDialogForm';

const Form = () => <Field name='fieldName' />;

export default {
  title: 'common/ResponsiveDialogForm',
  component: ResponsiveDialogForm,
};

const Template = (args) => <ResponsiveDialogForm {...args} />;

export const Desktop = Template.bind({});
Desktop.args = {
  actionText: 'Apply',
  FormComponent: Form,
  initialValues: { fieldName: 'field value' },
  onClose: action('close'),
  onSubmit: action('submit'),
  open: true,
  title: 'Dialog Title',
};

export const Mobile = Template.bind({});
Mobile.args = Desktop.args;
Mobile.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};
