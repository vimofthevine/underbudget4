import moment from 'moment';
import React from 'react';

import TokensTable from './TokensTable';

export default {
  title: 'tokens/TokensTable',
  component: TokensTable,
};

export const NoTokens = () => <TokensTable tokens={[]} />;

export const OneToken = () => (
  <TokensTable
    tokens={[
      {
        issued: moment().subtract(1, 'day').toISOString(),
        source: 'device #1',
        _links: { self: { href: '/api/tokens/testJwtId1' } },
      },
    ]}
  />
);

export const SeveralTokens = () => (
  <TokensTable
    tokens={[
      {
        issued: moment().subtract(1, 'day').toISOString(),
        source: 'device #1',
        _links: { self: { href: '/api/tokens/testJwtId1' } },
      },
      {
        issued: moment().subtract(9, 'day').toISOString(),
        source: 'device #2',
        _links: { self: { href: '/api/tokens/testJwtId2' } },
      },
      {
        issued: moment().subtract(25, 'minute').toISOString(),
        source: 'device #3',
        _links: { self: { href: '/api/tokens/testJwtId3' } },
      },
    ]}
  />
);