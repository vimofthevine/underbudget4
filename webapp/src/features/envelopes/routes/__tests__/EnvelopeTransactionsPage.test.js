import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import createMediaQuery from 'tests/createMediaQuery';
import renderWithRouter from 'tests/renderWithRouter';
import EnvelopeTransactionsPage from '../EnvelopeTransactionsPage';

const render = ({ route = '/envelope/7', width = '800px' } = {}) => {
  window.HTMLElement.prototype.scrollTo = () => 0;
  window.matchMedia = createMediaQuery(width);
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2').reply(200, { currency: 840 });
  mockAxios.onGet('/api/envelopes/7').reply(200, { name: 'My Envelope Name' });
  mockAxios.onGet('/api/envelopes/7/balance').reply(200, { balance: 8675309, total: 472 });
  mockAxios.onGet(/\/api\/envelopes\/7\/transactions.*/).reply(200, {
    total: 1,
    transactions: [
      {
        id: 15,
        transactionId: 42,
        recordedDate: '2021-05-04', // May the 4th be with you
        payee: 'Darth Vader',
        memo: '',
        cleared: false,
        type: 'expense',
        amount: -8000,
        balance: 8675309,
      },
    ],
  });
  mockAxios.onGet('/api/transactions/42').reply(200, {
    payee: '',
    recordedDate: '',
    type: '',
    accountTransactions: [],
    envelopeTransactions: [],
  });

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/envelope/:id/*' element={<EnvelopeTransactionsPage />} />
        </Routes>
      </QueryClientProvider>,
      { route },
    ),
    mockAxios,
    queryClient,
  };
};

// TODO implement these tests
// test('should display create-transaction dialog if initial route matches', async () => {});

test('should display transaction details dialog if initial route matches', async () => {
  const { history } = render({ route: '/envelope/1/transaction/42' });
  expect(screen.getByRole('heading', { name: /details/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /close/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/envelope/1'));
  expect(screen.queryByRole('heading', { name: /details/i })).not.toBeInTheDocument();
});

test('should display modify-envelope dialog if initial route matches', async () => {
  const { history } = render({ route: '/envelope/1/modify' });
  expect(screen.getByRole('heading', { name: /modify envelope/i })).toBeInTheDocument();

  await waitFor(() => expect(history.location.pathname).toBe('/envelope/1'));
  expect(screen.queryByRole('heading', { name: /modify envelope/i })).not.toBeInTheDocument();
});

test('should prompt to confirm deletion of envelope', async () => {
  const { history, mockAxios, queryClient } = render();
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
  mockAxios.onDelete('/api/envelopes/7').reply(204);

  await waitFor(() =>
    expect(screen.getByRole('heading')).toHaveTextContent('My Envelope Name | $86,753.09'),
  );

  // Reject cancellation
  userEvent.click(screen.getByRole('button', { name: /open actions menu/i }));
  userEvent.click(screen.getByRole('menuitem', { name: /delete envelope/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /cancel/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  expect(mockAxios.history.delete).toHaveLength(0);

  // Confirm cancellation
  userEvent.click(screen.getByRole('button', { name: /open actions menu/i }));
  userEvent.click(screen.getByRole('menuitem', { name: /delete envelope/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /ok/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(mockAxios.history.delete).toHaveLength(1));
  expect(mockAxios.history.delete[0].url).toBe('/api/envelopes/7');
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-categories', { ledger: '2' }]);

  await waitFor(() => expect(history.location.pathname).toBe('/envelopes'));
}, 15000);

// TODO implement these tests
// test('should archive envelope', async () => {});

// test('should unarchive envelope', async () => {});

test('should open dialogs when using nav bar actions', async () => {
  const { history } = render();

  // Make sure no dialogs open initially
  expect(screen.queryAllByRole('heading')).toHaveLength(1);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /modify envelope$/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify envelope/i })).toBeInTheDocument(),
  );
  expect(history.location.pathname).toBe('/envelope/7/modify');

  // TODO open create-transaction dialog
});

test('should display envelope name and balance in app bar', async () => {
  render();
  const heading = screen.getByRole('heading');
  expect(heading).toHaveTextContent('...');
  await waitFor(() => expect(heading).toHaveTextContent('My Envelope Name | $86,753.09'));
});

test('should display transactions', async () => {
  render();
  await waitFor(() =>
    expect(screen.getByRole('cell', { name: 'Darth Vader' })).toBeInTheDocument(),
  );
});
