import {
  configure,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mediaQuery from 'css-mediaquery';
import moment from 'moment';
import React from 'react';
import { ReactQueryConfigProvider, queryCache, setConsole } from 'react-query';

import renderWithRouter from '../../../tests/renderWithRouter';
import LedgersPage from './LedgersPage';

const queryConfig = {
  retryDelay: 200,
};

const render = () =>
  renderWithRouter(
    <ReactQueryConfigProvider config={queryConfig}>
      <LedgersPage />
    </ReactQueryConfigProvider>,
  );

const createMediaQuery = (width) => (query) => ({
  matches: mediaQuery.match(query, { width }),
  addListener: () => 0,
  removeListener: () => 0,
});

const ledger1 = {
  id: 'ledger-id-1',
  name: 'My Ledger',
  currency: 840,
  lastModified: moment().subtract(1, 'hour'),
};
const ledger2 = {
  id: 'ledger-id-2',
  name: 'Demo Ledger',
  currency: 978,
  lastModified: moment().subtract(4, 'month'),
};

describe('LedgersPage', () => {
  beforeEach(() => {
    configure({ defaultHidden: true });
    window.HTMLElement.prototype.scrollTo = () => 0;
    queryCache.clear();
    setConsole({
      log: () => 0,
      warn: () => 0,
      error: () => 0,
    });
  });

  it('should do nothing when delete action is cancelled', async () => {
    window.matchMedia = createMediaQuery('800px');

    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=0&size=10').reply(200, {
      _embedded: { ledgers: [ledger1, ledger2] },
      page: { totalElements: 2 },
    });

    render();

    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

    const rows = screen.queryAllByRole('row');
    const row1 = within(rows[1]);
    fireEvent.click(row1.getByRole('button', { name: /delete ledger/i }));

    await waitFor(() => expect(screen.getByText('Delete ledger My Ledger?')).toBeInTheDocument());
    fireEvent.click(screen.getByText(/cancel/i));

    await waitForElementToBeRemoved(() => screen.queryByText('Delete ledger My Ledger?'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should show error message when failed to delete', async () => {
    window.matchMedia = createMediaQuery('400px');

    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=0&size=10').reply(200, {
      _embedded: { ledgers: [ledger1, ledger2] },
      page: { totalElements: 2 },
    });
    mockAxios.onDelete('/api/ledgers/ledger-id-2').reply(400);

    render();

    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

    const rows = screen.queryAllByRole('row');
    const row2 = within(rows[2]);
    fireEvent.click(row2.getByRole('button', { name: /open ledger actions menu/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /delete ledger/i }));

    await waitFor(() => expect(screen.getByText('Delete ledger Demo Ledger?')).toBeInTheDocument());
    fireEvent.click(screen.getByText(/ok/i));

    await waitFor(() => expect(screen.getByText(/unable to delete ledger/i)).toBeInTheDocument());
  });

  it('should refetch ledgers when delete is successful', async () => {
    window.matchMedia = createMediaQuery('800px');

    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=0&size=10').replyOnce(200, {
      _embedded: { ledgers: [ledger1, ledger2] },
      page: { totalElements: 2 },
    });
    mockAxios.onGet('/api/ledgers?page=0&size=10').reply(200, {
      _embedded: { ledgers: [ledger2] },
      page: { totalElements: 1 },
    });
    mockAxios.onDelete('/api/ledgers/ledger-id-1').reply(200);

    render();

    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

    const rows = screen.queryAllByRole('row');
    const row1 = within(rows[1]);
    fireEvent.click(row1.getByRole('button', { name: /delete ledger/i }));

    await waitFor(() => expect(screen.getByText('Delete ledger My Ledger?')).toBeInTheDocument());
    fireEvent.click(screen.getByText(/ok/i));

    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(2));
  });

  it('should open modify ledger dialog on desktop', async () => {
    window.matchMedia = createMediaQuery('800px');

    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=0&size=10').reply(200, {
      _embedded: { ledgers: [ledger1, ledger2] },
      page: { totalElements: 2 },
    });

    render();

    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

    const rows = screen.queryAllByRole('row');
    const row1 = within(rows[1]);
    fireEvent.click(row1.getByRole('button', { name: /modify ledger/i }));

    await waitFor(() => expect(screen.getByRole('heading', { name: /modify ledger/i })));
    expect(screen.getByLabelText(/name/i)).toHaveValue('My Ledger');
  });

  it('should open modify ledger dialog on mobile', async () => {
    window.matchMedia = createMediaQuery('400px');

    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=0&size=10').reply(200, {
      _embedded: { ledgers: [ledger1, ledger2] },
      page: { totalElements: 2 },
    });

    render();

    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

    const rows = screen.queryAllByRole('row');
    const row2 = within(rows[2]);
    fireEvent.click(row2.getByRole('button', { name: /open ledger actions menu/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /modify ledger/i }));

    await waitFor(() => expect(screen.getByRole('heading', { name: /modify ledger/i })));
    expect(screen.getByLabelText(/name/i)).toHaveValue('Demo Ledger');
  });

  it('should open create ledger dialog', async () => {
    window.matchMedia = createMediaQuery('800px');

    render();

    fireEvent.click(screen.getByRole('button', { name: /create ledger/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: /create ledger/i })));
  });
});
