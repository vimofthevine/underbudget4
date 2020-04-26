/* eslint-disable react/prop-types */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moment from 'moment';
import React from 'react';
import { ReactQueryConfigProvider, queryCache } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { ConfirmationServiceProvider } from '../../common/ConfirmationService';
import { SnackbarServiceProvider } from '../../common/SnackbarService';
import TokensPage from './TokensPage';

const queryConfig = { retry: false };

export default {
  title: 'tokens/TokensPage',
  component: TokensPage,
  decorators: [
    (story) => {
      queryCache.clear();
      return story();
    },
    (story) => story({ mock: new MockAdapter(axios, { delayResponse: 1000 }) }),
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
    (story) => <ConfirmationServiceProvider>{story()}</ConfirmationServiceProvider>,
    (story) => <SnackbarServiceProvider>{story()}</SnackbarServiceProvider>,
    (story) => <ReactQueryConfigProvider config={queryConfig}>{story()}</ReactQueryConfigProvider>,
  ],
};

const createTokens = (start, stop) => {
  const tokens = [];
  let i = start;
  while (i <= stop) {
    tokens.push({
      issued: moment()
        .subtract(i * 2, 'hour')
        .toISOString(),
      jwtId: `token-id-${i}`,
      source: `Device #${i}`,
    });
    i += 1;
  }
  return tokens;
};

export const FewTokens = ({ mock }) => {
  mock.onGet('/api/tokens').reply(200, {
    _embedded: { tokens: createTokens(1, 5) },
  });
  return <TokensPage />;
};

export const ManyTokens = ({ mock }) => {
  mock.onGet('/api/tokens').reply(200, {
    _embedded: { tokens: createTokens(1, 42) },
  });
  return <TokensPage />;
};

export const DeleteTokenSuccess = ({ mock }) => {
  mock
    .onGet('/api/tokens')
    .reply(200, {
      _embedded: { tokens: createTokens(1, 5) },
    })
    .onDelete('/api/tokens/token-id-5')
    .reply(() => {
      mock.reset();
      mock.onGet('/api/tokens').reply(200, {
        _embedded: { tokens: createTokens(1, 4) },
      });
      return [200];
    });
  return <TokensPage />;
};

export const NetworkError = ({ mock }) => {
  mock.onGet('/api/tokens').timeout();
  return <TokensPage />;
};

export const Unauthorized = ({ mock }) => {
  mock.onGet('/api/tokens').reply(401);
  return <TokensPage />;
};

export const ServerError = ({ mock }) => {
  mock.onGet('/api/tokens').reply(500);
  return <TokensPage />;
};
