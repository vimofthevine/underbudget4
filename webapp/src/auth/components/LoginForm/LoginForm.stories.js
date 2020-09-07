import { action } from '@storybook/addon-actions';
import React from 'react';

import LoginForm from './LoginForm';

export default {
  title: 'login/LoginForm',
  component: LoginForm,
};

export const Default = () => <LoginForm onLogin={action('login')} />;
