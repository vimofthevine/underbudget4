import { configure, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import ModifyTransactionDialog from './ModifyTransactionDialog';

const render = (transaction, { getCode = 200, patchCode = 200 } = {}) => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet(`/api/transactions/${transaction.id}`).reply(getCode, transaction);
  mockApi.onPatch(`/api/transactions/${transaction.id}`).reply(patchCode);

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/transactions/:transactionId/modify' element={<ModifyTransactionDialog />} />
        </Routes>
      </QueryClientProvider>,
      { route: `/transactions/${transaction.id}/modify` },
    ),
    invalidateQueries,
    mockApi,
    queryClient,
  };
};

test('should close dialog when unable to fetch transaction', async () => {
  const { history } = render({ id: 8 }, { getCode: 404 });
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify transaction/i })).toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify transaction/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(history.location.pathname).toBe('/transactions/8'));
});

test('should show error message when request error', async () => {
  render(
    {
      id: 8,
      payee: 'Vendor',
      recordedDate: '2021-07-04',
      type: 'expense',
      accountTransactions: [{ id: 18, accountId: 2, memo: '', amount: -1234, cleared: false }],
      envelopeTransactions: [{ id: 28, envelopeId: 3, memo: '', amount: -1234 }],
    },
    { patchCode: 400 },
  );

  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /payee/i })).toHaveDisplayValue('Vendor'),
  );
  userEvent.type(screen.getByRole('textbox', { name: /payee/i }), ' ');
  userEvent.tab();

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.getByText(/unable to modify transaction/i)).toBeInTheDocument(),
  );
});

test('should allow modification of type', async () => {
  const { mockApi } = render({
    id: 8,
    payee: 'Vendor',
    recordedDate: '2021-07-04',
    type: 'income',
    accountTransactions: [{ id: 18, accountId: 2, memo: '', amount: 234, cleared: true }],
    envelopeTransactions: [{ id: 28, envelopeId: 3, memo: '', amount: 234 }],
  });

  await waitFor(() => expect(screen.getByText('Income')).toBeInTheDocument());

  userEvent.click(screen.getByRole('button', { name: /type/i }));
  const types = within(screen.getByRole('listbox'));
  userEvent.click(types.getByRole('option', { name: /refund/i }));

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify transaction/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.patch[0].data)).toEqual({
    payee: 'Vendor',
    recordedDate: '2021-07-04',
    type: 'refund',
    accountTransactions: {
      add: [],
      modify: [{ id: 18, accountId: 2, memo: '', amount: 234, cleared: true }],
      delete: [],
    },
    envelopeTransactions: {
      add: [],
      modify: [{ id: 28, envelopeId: 3, memo: '', amount: 234 }],
      delete: [],
    },
  });
});

test('should allow modification of splits', async () => {
  const { invalidateQueries, mockApi } = render({
    id: 8,
    payee: 'Vendor',
    recordedDate: '2021-07-04',
    type: 'expense',
    accountTransactions: [{ id: 18, accountId: 2, memo: '', amount: -1234, cleared: false }],
    envelopeTransactions: [{ id: 28, envelopeId: 3, memo: '', amount: -1234 }],
  });

  await waitFor(() => expect(screen.getByText('Expense')).toBeInTheDocument());

  const amounts = screen.getAllByRole('textbox', { name: /amount/i });
  fireEvent.change(amounts[0], { target: { value: '-$1,234.56' } });

  userEvent.click(screen.getByRole('checkbox'));

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify transaction/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.patch[0].data)).toEqual({
    payee: 'Vendor',
    recordedDate: '2021-07-04',
    type: 'expense',
    accountTransactions: {
      add: [],
      modify: [{ id: 18, accountId: 2, memo: '', amount: -123456, cleared: true }],
      delete: [],
    },
    envelopeTransactions: {
      add: [],
      modify: [{ id: 28, envelopeId: 3, memo: '', amount: -123456 }],
      delete: [],
    },
  });
  expect(invalidateQueries).toHaveBeenCalledTimes(5);
  expect(invalidateQueries).toHaveBeenCalledWith(['transaction', '8']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-balance', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-transactions', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '3']);
}, 15000);

test('should allow addition of new account splits', async () => {
  const { invalidateQueries, mockApi } = render({
    id: 8,
    payee: 'Vendor',
    recordedDate: '2021-07-04',
    type: 'refund',
    accountTransactions: [{ id: 18, accountId: 2, memo: '', amount: 10000, cleared: false }],
    envelopeTransactions: [{ id: 28, envelopeId: 3, memo: '', amount: 10000 }],
  });

  await waitFor(() => expect(screen.getByText('Refund')).toBeInTheDocument());

  userEvent.click(screen.getByRole('button', { name: /add account/i }));

  const amounts = screen.getAllByRole('textbox', { name: /amount/i });
  fireEvent.change(amounts[0], { target: { value: '$75.00' } });
  fireEvent.change(amounts[1], { target: { value: '$25.00' } });
  userEvent.type(screen.getAllByRole('textbox', { name: /account/i })[1], 'Category 3:Account 3');
  userEvent.tab();

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify transaction/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.patch[0].data)).toEqual({
    payee: 'Vendor',
    recordedDate: '2021-07-04',
    type: 'refund',
    accountTransactions: {
      add: [{ accountId: 3, memo: '', amount: 2500, cleared: false }],
      modify: [{ id: 18, accountId: 2, memo: '', amount: 7500, cleared: false }],
      delete: [],
    },
    envelopeTransactions: {
      add: [],
      modify: [{ id: 28, envelopeId: 3, memo: '', amount: 10000 }],
      delete: [],
    },
  });
  expect(invalidateQueries).toHaveBeenCalledTimes(7);
  expect(invalidateQueries).toHaveBeenCalledWith(['transaction', '8']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-balance', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-transactions', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-balance', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-transactions', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '3']);
}, 15000);

test('should allow consolidation of account splits', async () => {
  const { invalidateQueries, mockApi } = render({
    id: 8,
    payee: 'Vendor',
    recordedDate: '2021-07-04',
    type: 'refund',
    accountTransactions: [
      { id: 18, accountId: 2, memo: '', amount: 7500, cleared: false },
      { id: 38, accountId: 3, memo: '', amount: 2500, cleared: false },
    ],
    envelopeTransactions: [{ id: 28, envelopeId: 3, memo: '', amount: 10000 }],
  });

  await waitFor(() =>
    expect(screen.queryAllByRole('textbox', { name: /account/i })).toHaveLength(2),
  );

  fireEvent.change(screen.getAllByRole('textbox', { name: /amount/i })[1], {
    target: { value: '$100.00' },
  });

  userEvent.click(screen.getAllByRole('button', { name: /delete account split/i })[0]);
  await waitFor(() =>
    expect(screen.queryAllByRole('textbox', { name: /account/i })).toHaveLength(1),
  );

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() => expect(mockApi.history.patch).toHaveLength(1));
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify transaction/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.patch[0].data)).toEqual({
    payee: 'Vendor',
    recordedDate: '2021-07-04',
    type: 'refund',
    accountTransactions: {
      add: [],
      modify: [{ id: 38, accountId: 3, memo: '', amount: 10000, cleared: false }],
      delete: [18],
    },
    envelopeTransactions: {
      add: [],
      modify: [{ id: 28, envelopeId: 3, memo: '', amount: 10000 }],
      delete: [],
    },
  });
  expect(invalidateQueries).toHaveBeenCalledTimes(7);
  expect(invalidateQueries).toHaveBeenCalledWith(['transaction', '8']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-balance', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-transactions', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-balance', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-transactions', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '3']);
}, 15000);

test('should allow addition of new envelope splits', async () => {
  const { invalidateQueries, mockApi } = render({
    id: 8,
    payee: 'Vendor',
    recordedDate: '2021-07-04',
    type: 'income',
    accountTransactions: [{ id: 18, accountId: 2, memo: '', amount: 10000, cleared: false }],
    envelopeTransactions: [{ id: 28, envelopeId: 3, memo: '', amount: 10000 }],
  });

  await waitFor(() => expect(screen.getByText('Income')).toBeInTheDocument());

  userEvent.click(screen.getByRole('button', { name: /add envelope/i }));

  const amounts = screen.getAllByRole('textbox', { name: /amount/i });
  fireEvent.change(amounts[1], { target: { value: '$75.00' } });
  fireEvent.change(amounts[2], { target: { value: '$25.00' } });
  userEvent.type(screen.getAllByRole('textbox', { name: /envelope/i })[1], 'Category 1:Envelope 1');
  userEvent.tab();

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify transaction/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.patch[0].data)).toEqual({
    payee: 'Vendor',
    recordedDate: '2021-07-04',
    type: 'income',
    accountTransactions: {
      add: [],
      modify: [{ id: 18, accountId: 2, memo: '', amount: 10000, cleared: false }],
      delete: [],
    },
    envelopeTransactions: {
      add: [{ envelopeId: 1, memo: '', amount: 2500 }],
      modify: [{ id: 28, envelopeId: 3, memo: '', amount: 7500 }],
      delete: [],
    },
  });
  expect(invalidateQueries).toHaveBeenCalledTimes(7);
  expect(invalidateQueries).toHaveBeenCalledWith(['transaction', '8']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-balance', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-transactions', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '1']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '1']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '3']);
}, 15000);

test('should allow consolidation of envelope splits', async () => {
  const { invalidateQueries, mockApi } = render({
    id: 8,
    payee: 'Vendor',
    recordedDate: '2021-07-04',
    type: 'expense',
    accountTransactions: [{ id: 18, accountId: 2, memo: '', amount: -10000, cleared: false }],
    envelopeTransactions: [
      { id: 28, envelopeId: 3, memo: '', amount: -2500 },
      { id: 38, envelopeId: 1, memo: '', amount: -7500 },
    ],
  });

  await waitFor(() =>
    expect(screen.queryAllByRole('textbox', { name: /envelope/i })).toHaveLength(2),
  );

  fireEvent.change(screen.getAllByRole('textbox', { name: /amount/i })[2], {
    target: { value: '-$100.00' },
  });

  userEvent.click(screen.getAllByRole('button', { name: /delete envelope split/i })[0]);
  await waitFor(() =>
    expect(screen.queryAllByRole('textbox', { name: /envelope/i })).toHaveLength(1),
  );

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() => expect(mockApi.history.patch).toHaveLength(1));
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify transaction/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.patch[0].data)).toEqual({
    payee: 'Vendor',
    recordedDate: '2021-07-04',
    type: 'expense',
    accountTransactions: {
      add: [],
      modify: [{ id: 18, accountId: 2, memo: '', amount: -10000, cleared: false }],
      delete: [],
    },
    envelopeTransactions: {
      add: [],
      modify: [{ id: 38, envelopeId: 1, memo: '', amount: -10000 }],
      delete: [28],
    },
  });
  expect(invalidateQueries).toHaveBeenCalledTimes(7);
  expect(invalidateQueries).toHaveBeenCalledWith(['transaction', '8']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-balance', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['account-transactions', '2']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '1']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '1']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-balance', '3']);
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-transactions', '3']);
}, 15000);
