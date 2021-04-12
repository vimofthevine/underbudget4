import { action } from '@storybook/addon-actions';
import { Field } from 'formik';
import React from 'react';

import { ConfirmationContextProvider } from '../../contexts/confirmation';
import FormDialog from './FormDialog';

const Form = () => <Field name='fieldName' />;

export default {
  title: 'common/FormDialog',
  component: FormDialog,
  decorators: [(story) => <ConfirmationContextProvider>{story()}</ConfirmationContextProvider>],
};

const Template = (args) => <FormDialog FormComponent={Form} {...args} />;

export const Desktop = Template.bind({});
Desktop.args = {
  actionText: 'Apply',
  initialValues: { fieldName: 'field value' },
  onSubmit: action('submit'),
  title: 'Dialog Title',
};

export const Mobile = Template.bind({});
Mobile.args = Desktop.args;
Mobile.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};
