import { waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moment from 'moment';
import React from 'react';
import { ReactQueryConfigProvider } from 'react-query';

import render from '../../../tests/renderWithRouter';
import TokensPage from './TokensPage';

const queryConfig = {
  retryDelay: 200,
};

describe('TokensPage', () => {
  it('should show loading indicator while fetching tokens', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/tokens').reply(500);

    const { queryByRole } = render(
      <ReactQueryConfigProvider config={queryConfig}>
        <TokensPage />
      </ReactQueryConfigProvider>,
    );

    await waitFor(() => expect(queryByRole('progressbar')).toBeInTheDocument());
  });

  it('should show error message when failed to fetch', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/tokens').reply(401);

    const { queryByRole, queryByText } = render(
      <ReactQueryConfigProvider config={queryConfig}>
        <TokensPage />
      </ReactQueryConfigProvider>,
    );

    await waitFor(() => expect(queryByRole('alert')).toBeInTheDocument());
    expect(queryByText(/.*401.*/)).toBeInTheDocument();
  });

  it('should show tokens from successful fetch', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/tokens').reply(200, {
      _embedded: {
        tokens: [
          {
            issued: moment().subtract(1, 'hour'),
            source: 'Mobile Device',
            _links: { self: { href: 'http://localhost:9090/api/tokens/testTokenId1' } },
          },
          {
            issued: moment().subtract(1, 'day'),
            source: 'Desktop Device',
            _links: { self: { href: 'http://localhost:9090/api/tokens/testTokenId2' } },
          },
        ],
      },
    });

    const { queryByRole, queryByText } = render(
      <ReactQueryConfigProvider config={queryConfig}>
        <TokensPage />
      </ReactQueryConfigProvider>,
    );

    await waitFor(() => expect(queryByText('Mobile Device')).toBeInTheDocument());
    expect(queryByText(/an hour ago/i)).toBeInTheDocument();

    expect(queryByText('Desktop Device')).toBeInTheDocument();
    expect(queryByText(/a day ago/i)).toBeInTheDocument();

    expect(queryByRole('progressbar')).not.toBeInTheDocument();
    expect(queryByRole('alert')).not.toBeInTheDocument();
  });
});
