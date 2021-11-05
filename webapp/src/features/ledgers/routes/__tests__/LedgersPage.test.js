import { configure, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moment from 'moment';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import createMediaQuery from 'test/createMediaQuery';
import renderWithRouter from 'test/renderWithRouter';
import LedgersPage from '../LedgersPage';

const render = () => {
  configure({ defaultHidden: true });
  window.HTMLElement.prototype.scrollTo = () => 0;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retryDelay: 200,
      },
    },
  });

  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <LedgersPage />
    </QueryClientProvider>,
  );
};

const ledger1 = {
  id: 'ledger-id-1',
  name: 'My Ledger',
  currency: 840,
  lastUpdated: moment().subtract(1, 'hour'),
};
const ledger2 = {
  id: 'ledger-id-2',
  name: 'Demo Ledger',
  currency: 978,
  lastUpdated: moment().subtract(4, 'month'),
};

test('should do nothing when delete action is cancelled', async () => {
  window.matchMedia = createMediaQuery('800px');

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
    ledgers: [ledger1, ledger2],
    total: 2,
  });

  render();

  await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

  const rows = screen.queryAllByRole('row');
  const row1 = within(rows[1]);
  userEvent.click(row1.getByRole('button', { name: /delete ledger/i }));

  await waitFor(() => expect(screen.getByText('Delete ledger My Ledger?')).toBeInTheDocument());
  userEvent.click(screen.getByText(/cancel/i));

  await waitFor(() =>
    expect(screen.queryByText('Delete ledger My Ledger?')).not.toBeInTheDocument(),
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('should show error message when failed to delete', async () => {
  window.matchMedia = createMediaQuery('400px');

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
    ledgers: [ledger1, ledger2],
    total: 2,
  });
  mockAxios.onDelete('/api/ledgers/ledger-id-2').reply(400);

  render();

  await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

  const rows = screen.queryAllByRole('row');
  const row2 = within(rows[2]);
  userEvent.click(row2.getByRole('button', { name: /open ledger actions menu/i }));
  userEvent.click(screen.getByRole('menuitem', { name: /delete ledger/i }));

  await waitFor(() => expect(screen.getByText('Delete ledger Demo Ledger?')).toBeInTheDocument());
  userEvent.click(screen.getByText(/ok/i));

  await waitFor(() => expect(screen.getByText(/unable to delete ledger/i)).toBeInTheDocument());
});

test('should refetch ledgers when delete is successful', async () => {
  window.matchMedia = createMediaQuery('800px');

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers?page=1&size=10').replyOnce(200, {
    ledgers: [ledger1, ledger2],
    total: 2,
  });
  mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
    ledgers: [ledger2],
    total: 1,
  });
  mockAxios.onDelete('/api/ledgers/ledger-id-1').reply(200);

  render();

  await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

  const rows = screen.queryAllByRole('row');
  const row1 = within(rows[1]);
  userEvent.click(row1.getByRole('button', { name: /delete ledger/i }));

  await waitFor(() => expect(screen.getByText('Delete ledger My Ledger?')).toBeInTheDocument());
  userEvent.click(screen.getByText(/ok/i));

  await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(2));
});

test('should open modify ledger dialog on desktop', async () => {
  window.matchMedia = createMediaQuery('800px');

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
    ledgers: [ledger1, ledger2],
    total: 2,
  });

  const { history } = render();

  await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

  const rows = screen.queryAllByRole('row');
  const row1 = within(rows[1]);
  userEvent.click(row1.getByRole('button', { name: /modify ledger/i }));

  await waitFor(() => expect(history.location.pathname).toBe('/modify/ledger-id-1'));
});

test('should open modify ledger dialog on mobile', async () => {
  window.matchMedia = createMediaQuery('400px');

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
    ledgers: [ledger1, ledger2],
    total: 2,
  });

  const { history } = render();

  await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

  const rows = screen.queryAllByRole('row');
  const row2 = within(rows[2]);
  userEvent.click(row2.getByRole('button', { name: /open ledger actions menu/i }));
  userEvent.click(screen.getByRole('menuitem', { name: /modify ledger/i }));

  await waitFor(() => expect(history.location.pathname).toBe('/modify/ledger-id-2'));
});

test('should navigate to create-ledger route', async () => {
  window.matchMedia = createMediaQuery('800px');

  const { history } = render();

  userEvent.click(screen.getByRole('button', { name: /create ledger/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/create'));
});

test('user is prompted to create demo when no ledgers exist', async () => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
    ledgers: [],
    total: 0,
  });

  render();
  expect(screen.queryByRole('heading', { name: /create demo/i })).not.toBeInTheDocument();

  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /cancel/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  expect(screen.queryByRole('heading', { name: /create demo/i })).not.toBeInTheDocument();
});

test('dialog is opened if user confirms to create demo when no ledgers exist', async () => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
    ledgers: [],
    total: 0,
  });

  const { history } = render();
  expect(screen.queryByRole('heading', { name: /create demo/i })).not.toBeInTheDocument();

  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /ok/i }));

  await waitFor(() => expect(history.location.pathname).toBe('/create-demo'));
});
