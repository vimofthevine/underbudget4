import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import queryConfig from './queryConfig';

const queryClient = new QueryClient({
  defaultOptions: {
    ...queryConfig,
    queries: {
      ...queryConfig.queries,
      retryDelay: 100,
    },
  },
});

const Fetch = () => {
  const { status } = useQuery('test', () => axios.get('/'));
  return <span>{status}</span>;
};

describe('query configuration', () => {
  it('should not retry on error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/').reply(503);

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <Fetch />
      </QueryClientProvider>,
    );

    await waitFor(() => expect(getByText('error')).toBeInTheDocument());
    expect(mockAxios.history.get).toHaveLength(1);
  });
});
