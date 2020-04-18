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
        jwtId: 'testJwtId',
        source: 'device #1',
      },
    ]}
  />
);

export const SeveralTokens = () => (
  <TokensTable
    tokens={[
      {
        issued: moment().subtract(1, 'day').toISOString(),
        jwtId: 'testJwtId1',
        source: 'device #1',
      },
      {
        issued: moment().subtract(9, 'day').toISOString(),
        jwtId: 'testJwtId2',
        source: 'device #2',
      },
      {
        issued: moment().subtract(25, 'minute').toISOString(),
        jwtId: 'testJwtId3',
        source: 'device #3',
      },
    ]}
  />
);
