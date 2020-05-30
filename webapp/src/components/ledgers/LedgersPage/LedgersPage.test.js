import { configure, fireEvent, screen, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mediaQuery from 'css-mediaquery';
import moment from 'moment';
import React from 'react';
import { ReactQueryConfigProvider, queryCache } from 'react-query';

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

const currencies = [840, 978, 980];
const createLedgers = (from, to) => {
  const ledgers = [];
  let i = from;
  while (i < to) {
    ledgers.push({
      id: `ledger-id-${i}`,
      name: `Ledger ${i}`,
      currency: currencies[i % currencies.length],
      lastModified: moment()
        .subtract(i * 2 + 4, 'day')
        .toISOString(),
    });
    i += 1;
  }
  return ledgers;
};

describe('LedgersPage', () => {
  beforeEach(() => {
    configure({ defaultHidden: true });
    window.HTMLElement.prototype.scrollTo = () => 0;
    queryCache.clear();
  });

  it('should show error message when not logged in', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet(/\/api\/ledgers.*/).reply(401);

    render();

    await waitFor(() => expect(screen.queryByRole('alert')).toBeInTheDocument());
    expect(screen.getByText(/you are no longer logged in/i)).toBeInTheDocument();
  });

  it('should show error message when network error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet(/\/api\/ledgers.*/).timeout();

    render();

    await waitFor(() => expect(screen.queryByRole('alert')).toBeInTheDocument());
    expect(screen.getByText(/unable to retrieve ledgers/i)).toBeInTheDocument();
  });

  it('should show error message when server error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet(/\/api\/ledgers.*/).reply(500);

    render();

    await waitFor(() => expect(screen.queryByRole('alert')).toBeInTheDocument());
    expect(screen.getByText(/an error occurred on the server/i)).toBeInTheDocument();
  });

  it('should show one page of ledgers on desktop', async () => {
    window.matchMedia = createMediaQuery('800px');

    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=0&size=10').reply(200, {
      _embedded: { ledgers: [ledger1, ledger2] },
      page: { totalElements: 2 },
    });

    render();

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    const rows = screen.queryAllByRole('row');

    const header = within(rows[0]);
    expect(header.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(header.getByRole('columnheader', { name: 'Currency' })).toBeInTheDocument();
    expect(header.getByRole('columnheader', { name: 'Last Modified' })).toBeInTheDocument();
    expect(header.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();

    const row1 = within(rows[1]);
    expect(row1.getByRole('cell', { name: 'My Ledger' })).toBeInTheDocument();
    expect(row1.getByRole('cell', { name: 'USD' })).toBeInTheDocument();
    expect(row1.getByRole('cell', { name: 'an hour ago' })).toBeInTheDocument();
    expect(row1.getByRole('button', { name: /modify ledger/i })).toBeInTheDocument();
    expect(row1.getByRole('button', { name: /delete ledger/i })).toBeInTheDocument();
    expect(
      row1.queryByRole('button', { name: /open ledger actions menu/i }),
    ).not.toBeInTheDocument();

    const row2 = within(rows[2]);
    expect(row2.getByRole('cell', { name: 'Demo Ledger' })).toBeInTheDocument();
    expect(row2.getByRole('cell', { name: 'EUR' })).toBeInTheDocument();
    expect(row2.getByRole('cell', { name: '4 months ago' })).toBeInTheDocument();
    expect(row2.getByRole('button', { name: /modify ledger/i })).toBeInTheDocument();
    expect(row2.getByRole('button', { name: /delete ledger/i })).toBeInTheDocument();
    expect(
      row2.queryByRole('button', { name: /open ledger actions menu/i }),
    ).not.toBeInTheDocument();

    expect(screen.queryByRole('button', { name: /next page/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /previous page/i })).not.toBeInTheDocument();
  });

  it('should show one page of ledgers on mobile', async () => {
    window.matchMedia = createMediaQuery('400px');

    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=0&size=10').reply(200, {
      _embedded: { ledgers: [ledger1, ledger2] },
      page: { totalElements: 2 },
    });

    render();

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    const rows = screen.queryAllByRole('row');

    const header = within(rows[0]);
    expect(header.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(header.getByRole('columnheader', { name: 'Currency' })).toBeInTheDocument();
    expect(header.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
    expect(header.queryByRole('columnheader', { name: 'Last Modified' })).not.toBeInTheDocument();

    const row1 = within(rows[1]);
    expect(row1.getByRole('cell', { name: 'My Ledger' })).toBeInTheDocument();
    expect(row1.getByRole('cell', { name: 'USD' })).toBeInTheDocument();
    expect(row1.getByRole('button', { name: /open ledger actions menu/i })).toBeInTheDocument();
    expect(row1.queryByRole('button', { name: /modify ledger/i })).not.toBeInTheDocument();
    expect(row1.queryByRole('button', { name: /delete ledger/i })).not.toBeInTheDocument();
    expect(row1.queryByRole('cell', { name: 'an hour ago' })).not.toBeInTheDocument();

    const row2 = within(rows[2]);
    expect(row2.getByRole('cell', { name: 'Demo Ledger' })).toBeInTheDocument();
    expect(row2.getByRole('cell', { name: 'EUR' })).toBeInTheDocument();
    expect(row2.getByRole('button', { name: /open ledger actions menu/i })).toBeInTheDocument();
    expect(row2.queryByRole('button', { name: /modify ledger/i })).not.toBeInTheDocument();
    expect(row2.queryByRole('button', { name: /delete ledger/i })).not.toBeInTheDocument();
    expect(row2.queryByRole('cell', { name: '4 months ago' })).not.toBeInTheDocument();
  });

  it('should show multiple pages of ledgers on desktop', async () => {
    window.matchMedia = createMediaQuery('800px');

    const mockAxios = new MockAdapter(axios, { delayResponse: 0 });
    mockAxios.onGet('/api/ledgers?page=0&size=10').reply(200, {
      _embedded: { ledgers: createLedgers(0, 10) },
      page: { totalElements: 24 },
    });
    mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
      _embedded: { ledgers: createLedgers(10, 20) },
      page: { totalElements: 24 },
    });
    mockAxios.onGet('/api/ledgers?page=2&size=10').reply(200, {
      _embedded: { ledgers: createLedgers(20, 24) },
      page: { totalElements: 24 },
    });

    render();

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const firstPageRows = screen.queryAllByRole('row');
    expect(firstPageRows).toHaveLength(11);

    const firstPageFirstRow = within(firstPageRows[1]);
    expect(firstPageFirstRow.getByRole('cell', { name: 'Ledger 0' })).toBeInTheDocument();
    expect(firstPageFirstRow.getByRole('cell', { name: 'USD' })).toBeInTheDocument();
    expect(firstPageFirstRow.getByRole('cell', { name: '4 days ago' })).toBeInTheDocument();

    const firstPageLastRow = within(firstPageRows[10]);
    expect(firstPageLastRow.getByRole('cell', { name: 'Ledger 9' })).toBeInTheDocument();
    expect(firstPageLastRow.getByRole('cell', { name: 'USD' })).toBeInTheDocument();
    expect(firstPageLastRow.getByRole('cell', { name: '22 days ago' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const secondPageRows = screen.queryAllByRole('row');
    expect(secondPageRows).toHaveLength(11);

    const secondPageFirstRow = within(secondPageRows[1]);
    expect(secondPageFirstRow.getByRole('cell', { name: 'Ledger 10' })).toBeInTheDocument();
    expect(secondPageFirstRow.getByRole('cell', { name: 'EUR' })).toBeInTheDocument();
    expect(secondPageFirstRow.getByRole('cell', { name: '24 days ago' })).toBeInTheDocument();

    const secondPageLastRow = within(secondPageRows[10]);
    expect(secondPageLastRow.getByRole('cell', { name: 'Ledger 19' })).toBeInTheDocument();
    expect(secondPageLastRow.getByRole('cell', { name: 'EUR' })).toBeInTheDocument();
    expect(secondPageLastRow.getByRole('cell', { name: 'a month ago' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /previous page/i })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const thirdPageRows = screen.queryAllByRole('row');
    expect(thirdPageRows).toHaveLength(5);

    const thirdPageFirstRow = within(thirdPageRows[1]);
    expect(thirdPageFirstRow.getByRole('cell', { name: 'Ledger 20' })).toBeInTheDocument();
    expect(thirdPageFirstRow.getByRole('cell', { name: 'UAH' })).toBeInTheDocument();
    expect(thirdPageFirstRow.getByRole('cell', { name: 'a month ago' })).toBeInTheDocument();

    const thirdPageLastRow = within(thirdPageRows[4]);
    expect(thirdPageLastRow.getByRole('cell', { name: 'Ledger 23' })).toBeInTheDocument();
    expect(thirdPageLastRow.getByRole('cell', { name: 'UAH' })).toBeInTheDocument();
    expect(thirdPageLastRow.getByRole('cell', { name: '2 months ago' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    expect(screen.queryAllByRole('row')).toHaveLength(11);
  }, 30000);
});
