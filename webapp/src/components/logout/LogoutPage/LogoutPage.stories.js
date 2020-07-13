import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import removeApiToken from '../../../common/utils/removeApiToken';
import setApiToken from '../../../common/utils/setApiToken';
import LogoutPage from './LogoutPage';

const TEST_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZXN0aXNzIiwiaWF0IjoxNTg3MjE0NzUzLCJleHAiOjE2MTg3NTA3NTMsImF1ZCI6InRlc3RhdWQiLCJzdWIiOiJ0ZXN0c3ViIiwianRpIjoidGVzdEp3dElkIn0.nEqpS32ni_t9c2aAcDPJuMHsOIr7YFPIfa8Hl6txbh8';

export default {
  title: 'logout/LogoutPage',
  component: LogoutPage,
  decorators: [
    (story) => story({ mock: new MockAdapter(axios) }),
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
  ],
};

export const NotLoggedIn = () => {
  removeApiToken();
  return <LogoutPage />;
};

export const WasLoggedIn = () => {
  setApiToken(TEST_TOKEN);
  return <LogoutPage />;
};
