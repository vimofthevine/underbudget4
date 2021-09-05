import { configure, fireEvent, screen, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import moment from 'moment';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import createMediaQuery from 'tests/createMediaQuery';
import renderWithRouter from 'tests/renderWithRouter';
import LedgersListing from '../LedgersListing';

const render = ({ route = '/ledgers', width = '800px' } = {}) => {
  window.matchMedia = createMediaQuery(width);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retryDelay: 200,
      },
    },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <LedgersListing />
      </QueryClientProvider>,
      { route },
    ),
    queryClient,
  };
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
      lastUpdated: moment()
        .subtract(i * 2 + 4, 'day')
        .toISOString(),
    });
    i += 1;
  }
  return ledgers;
};

describe('LedgersListing', () => {
  beforeEach(() => {
    configure({ defaultHidden: true });
    window.HTMLElement.prototype.scrollTo = () => 0;
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
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
      ledgers: createLedgers(0, 2),
      total: 2,
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
    expect(row1.getByRole('cell', { name: 'Ledger 0' })).toBeInTheDocument();
    expect(row1.getByRole('cell', { name: 'USD' })).toBeInTheDocument();
    expect(row1.getByRole('cell', { name: '4 days ago' })).toBeInTheDocument();
    expect(row1.getByRole('button', { name: /modify ledger/i })).toBeInTheDocument();
    expect(row1.getByRole('button', { name: /delete ledger/i })).toBeInTheDocument();
    expect(
      row1.queryByRole('button', { name: /open ledger actions menu/i }),
    ).not.toBeInTheDocument();

    const row2 = within(rows[2]);
    expect(row2.getByRole('cell', { name: 'Ledger 1' })).toBeInTheDocument();
    expect(row2.getByRole('cell', { name: 'EUR' })).toBeInTheDocument();
    expect(row2.getByRole('cell', { name: '6 days ago' })).toBeInTheDocument();
    expect(row2.getByRole('button', { name: /modify ledger/i })).toBeInTheDocument();
    expect(row2.getByRole('button', { name: /delete ledger/i })).toBeInTheDocument();
    expect(
      row2.queryByRole('button', { name: /open ledger actions menu/i }),
    ).not.toBeInTheDocument();

    expect(screen.queryByRole('button', { name: /next page/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /previous page/i })).not.toBeInTheDocument();
  });

  it('should show one page of ledgers on mobile', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
      ledgers: createLedgers(0, 2),
      total: 2,
    });

    render({ width: '400px' });

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
    expect(row1.getByRole('cell', { name: 'Ledger 0' })).toBeInTheDocument();
    expect(row1.getByRole('cell', { name: 'USD' })).toBeInTheDocument();
    expect(row1.getByRole('button', { name: /open ledger actions menu/i })).toBeInTheDocument();
    expect(row1.queryByRole('button', { name: /modify ledger/i })).not.toBeInTheDocument();
    expect(row1.queryByRole('button', { name: /delete ledger/i })).not.toBeInTheDocument();
    expect(row1.queryByRole('cell', { name: 'an hour ago' })).not.toBeInTheDocument();

    const row2 = within(rows[2]);
    expect(row2.getByRole('cell', { name: 'Ledger 1' })).toBeInTheDocument();
    expect(row2.getByRole('cell', { name: 'EUR' })).toBeInTheDocument();
    expect(row2.getByRole('button', { name: /open ledger actions menu/i })).toBeInTheDocument();
    expect(row2.queryByRole('button', { name: /modify ledger/i })).not.toBeInTheDocument();
    expect(row2.queryByRole('button', { name: /delete ledger/i })).not.toBeInTheDocument();
    expect(row2.queryByRole('cell', { name: '4 months ago' })).not.toBeInTheDocument();
  });

  it('should show multiple pages of ledgers', async () => {
    const mockAxios = new MockAdapter(axios, { delayResponse: 0 });
    mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
      ledgers: createLedgers(0, 10),
      total: 24,
    });
    mockAxios.onGet('/api/ledgers?page=2&size=10').reply(200, {
      ledgers: createLedgers(10, 20),
      total: 24,
    });
    mockAxios.onGet('/api/ledgers?page=3&size=10').reply(200, {
      ledgers: createLedgers(20, 24),
      total: 24,
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
  }, 15000);

  it('should redirect to accounts page when selecting a ledger', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
      ledgers: createLedgers(0, 2),
      total: 2,
    });

    const { history } = render();

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

    const rows = screen.queryAllByRole('row');

    const row = within(rows[1]);
    fireEvent.click(row.getByRole('cell', { name: 'Ledger 0' }));
    expect(history.location.pathname).toBe('/accounts');
    expect(localStorage.getItem('underbudget.selected.ledger')).toBe('ledger-id-0');
  });

  it('should redirect to previous location state when selecting a ledger', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
      ledgers: createLedgers(0, 2),
      total: 2,
    });

    const { history } = render({
      route: {
        pathname: '/ledgers',
        state: { from: '/last-page' },
      },
    });

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

    const rows = screen.queryAllByRole('row');

    const row = within(rows[2]);
    fireEvent.click(row.getByRole('cell', { name: 'EUR' }));
    expect(history.location.pathname).toBe('/last-page');
    expect(localStorage.getItem('underbudget.selected.ledger')).toBe('ledger-id-1');
  });

  it('should prompt to confirm deletion of a ledger', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
      ledgers: createLedgers(0, 2),
      total: 2,
    });

    render();

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

    const rows = screen.queryAllByRole('row');

    const row1 = within(rows[1]);
    fireEvent.click(row1.getByRole('button', { name: /delete ledger/i }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
    );
    expect(mockAxios.history.delete).toHaveLength(0);
  });

  it('should delete ledger when confirmed', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onGet('/api/ledgers?page=1&size=10').reply(200, {
      ledgers: createLedgers(0, 2),
      total: 2,
    });
    mockAxios.onDelete('/api/ledgers/ledger-id-0').reply(204);

    const { queryClient } = render();
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByRole('row')).toHaveLength(3));

    const rows = screen.queryAllByRole('row');

    const row1 = within(rows[1]);
    fireEvent.click(row1.getByRole('button', { name: /delete ledger/i }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(mockAxios.history.delete).toHaveLength(1));
    expect(mockAxios.history.delete[0].url).toBe('/api/ledgers/ledger-id-0');
    expect(invalidateQueries).toHaveBeenCalledWith('ledgers');
  });
});
