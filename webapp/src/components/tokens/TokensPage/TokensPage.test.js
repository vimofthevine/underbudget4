import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moment from 'moment';
import React from 'react';
import { ReactQueryConfigProvider, setConsole } from 'react-query';

import render from '../../../tests/renderWithRouter';
import TokensPage from './TokensPage';

const queryConfig = {
  retryDelay: 200,
};

const token1 = {
  id: 'testTokenId0',
  issued: moment().subtract(1, 'hour'),
  source: 'Mobile Device',
  _links: { self: { href: 'http://localhost:9090/api/tokens/testTokenId1' } },
};
const token2 = {
  id: 'testTokenId2',
  issued: moment().subtract(1, 'day'),
  source: 'Desktop Device',
  _links: { self: { href: 'http://localhost:9090/api/tokens/testTokenId2' } },
};

describe('TokensPage', () => {
  beforeEach(() => {
    setConsole({
      log: () => 0,
      warn: () => 0,
      error: () => 0,
    });
  });

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
    mockAxios.onGet('/api/tokens').reply(200, { _embedded: { tokens: [token1, token2] } });

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

  it('should do nothing when delete action is cancelled', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/tokens').reply(200, { _embedded: { tokens: [token1, token2] } });

    render(
      <ReactQueryConfigProvider config={queryConfig}>
        <TokensPage />
      </ReactQueryConfigProvider>,
    );

    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

    const rows = screen.queryAllByRole('row');
    const { getByLabelText } = within(rows[2]);
    fireEvent.click(getByLabelText(/delete access token/i));

    await waitFor(() => expect(screen.getByText(/delete access token\?/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/cancel/i));

    await waitForElementToBeRemoved(() => screen.queryByText(/delete access token\?/i));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should show error message when failed to delete', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/tokens').reply(200, { _embedded: { tokens: [token1, token2] } });
    mockAxios.onDelete('/api/tokens/testTokenId2').reply(403);

    render(
      <ReactQueryConfigProvider config={queryConfig}>
        <TokensPage />
      </ReactQueryConfigProvider>,
    );

    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

    const rows = screen.queryAllByRole('row');
    const { getByLabelText } = within(rows[2]);
    fireEvent.click(getByLabelText(/delete access token/i));

    await waitFor(() => expect(screen.getByText(/delete access token\?/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText('OK'));

    await waitFor(() =>
      expect(screen.getByText('Unable to delete access token')).toBeInTheDocument(),
    );
  });

  it('should refetch tokens when delete is successful', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/tokens').replyOnce(200, { _embedded: { tokens: [token1, token2] } });
    mockAxios.onGet('/api/tokens').reply(200, { _embedded: { tokens: [token1] } });
    mockAxios.onDelete('/api/tokens/testTokenId2').reply(200);

    render(
      <ReactQueryConfigProvider config={queryConfig}>
        <TokensPage />
      </ReactQueryConfigProvider>,
    );

    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

    const rows = screen.queryAllByRole('row');
    const { getByLabelText } = within(rows[2]);
    fireEvent.click(getByLabelText(/delete access token/i));

    await waitFor(() => expect(screen.getByText(/delete access token\?/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(2));
  });
});
