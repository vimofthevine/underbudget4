import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { ReactQueryConfigProvider, setConsole, useQuery } from 'react-query';

import origQueryConfig from './queryConfig';

const queryConfig = {
  ...origQueryConfig,
  retryDelay: 100,
};

const Fetch = () => {
  const { status } = useQuery('test', () => axios.get('/'));
  return <span>{status}</span>;
};

describe('query configuration', () => {
  beforeEach(() => {
    setConsole({
      log: () => 0,
      warn: () => 0,
      error: () => 0,
    });
  });

  it('should not retry when 401 error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/').reply(401);

    const { getByText } = render(
      <ReactQueryConfigProvider config={queryConfig}>
        <Fetch />
      </ReactQueryConfigProvider>,
    );

    await waitFor(() => expect(getByText('error')).toBeInTheDocument());
    expect(mockAxios.history.get).toHaveLength(1);
  });

  it('should not retry when 403 error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/').reply(403);

    const { getByText } = render(
      <ReactQueryConfigProvider config={queryConfig}>
        <Fetch />
      </ReactQueryConfigProvider>,
    );

    await waitFor(() => expect(getByText('error')).toBeInTheDocument());
    expect(mockAxios.history.get).toHaveLength(1);
  });

  it('should retry when other error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/').reply(404);

    const { getByText } = render(
      <ReactQueryConfigProvider config={queryConfig}>
        <Fetch />
      </ReactQueryConfigProvider>,
    );

    await waitFor(() => expect(getByText('error')).toBeInTheDocument());
    expect(mockAxios.history.get).toHaveLength(4);
  });
});
