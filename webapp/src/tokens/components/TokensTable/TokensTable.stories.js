import { action } from '@storybook/addon-actions';
import moment from 'moment';
import React from 'react';

import TokensTable from './TokensTable';

export default {
  title: 'tokens/TokensTable',
  component: TokensTable,
};

export const NoTokens = () => <TokensTable onDelete={action('delete')} tokens={[]} />;

export const OneToken = () => (
  <TokensTable
    onDelete={action('delete')}
    tokens={[
      {
        issued: moment().subtract(1, 'day').toISOString(),
        jwtId: 'testJwtId1',
        source: 'device #1',
      },
    ]}
  />
);

export const SeveralTokens = () => (
  <TokensTable
    onDelete={action('delete')}
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
