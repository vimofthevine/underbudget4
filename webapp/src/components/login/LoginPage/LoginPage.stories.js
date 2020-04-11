/* eslint-disable react/prop-types */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import LoginPage from './LoginPage';

export default {
  title: 'login/LoginPage',
  component: LoginPage,
  decorators: [(story) => story({ mock: new MockAdapter(axios) })],
};

export const LoginFailure = ({ mock }) => {
  mock.onPost('/api/authenticate').reply(401);
  return <LoginPage />;
};

export const LoginSuccess = ({ mock }) => {
  mock.onPost('/api/authenticate').reply(201);
  return <LoginPage />;
};
