/* eslint-disable react/prop-types */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moment from 'moment';
import React from 'react';
import { queryCache } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import TokensPage from './TokensPage';

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
      source: `Device #${i}`,
      _links: { self: { href: `/api/tokens/token-id-${i}` } },
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

export const NetworkError = ({ mock }) => {
  mock.onGet('/api/tokens').timeout();
  return <TokensPage />;
};

export const Unauthorized = ({ mock }) => {
  mock.onGet('/api/tokens').reply(401);
  return <TokensPage />;
};
