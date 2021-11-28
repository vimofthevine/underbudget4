import { configure, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import { transactionGenerator } from 'test/data-generators';
import setupMockApi from 'test/setupMockApi';
import CreateReconciliationForm from '../CreateReconciliationForm';

const lastReconciliation = {
  beginningBalance: 105000,
  beginningDate: '2021-10-04',
  endingBalance: 125503,
  endingDate: '2021-11-03',
};
const clearedTransactionsUrl =
  '/api/account-transactions/search?accountId=9&recordedDate=lte:2021-12-03&reconciliationId=is:null&cleared=True&size=10000';

const render = (configureApi = () => 0) => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  configureApi(mockApi);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <CreateReconciliationForm accountId={9} parentRoute='/account/9' />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

const getParameterInputs = () => ({
  beginningBalance: screen.getByRole('textbox', { name: /beginning balance/i }),
  beginningDate: screen.getByRole('textbox', { name: /beginning date/i }),
  endingBalance: screen.getByRole('textbox', { name: /ending balance/i }),
  endingDate: screen.getByRole('textbox', { name: /ending date/i }),
});

const getNextButton = () => screen.getByRole('button', { name: /^next$/i });

const getPagination = (getFn = screen.getByRole) => ({
  nextPage: getFn('button', { name: /next page/i }),
  prevPage: getFn('button', { name: /previous page/i }),
});
const queryPagination = () => getPagination(screen.queryByRole);

const getRunningBalances = () => ({
  reconciledBalance: screen.getByRole('textbox', { name: /reconciled balance/i }),
  remainingBalance: screen.getByRole('textbox', { name: /remaining to be reconciled/i }),
});

const getCreateButton = () => screen.getByRole('button', { name: /create/i });

const expectParamEntryStep = (params, nextButton) => {
  expect(params.beginningBalance).toBeEnabled();
  expect(params.beginningDate).toBeEnabled();
  expect(params.endingBalance).toBeEnabled();
  expect(params.endingDate).toBeEnabled();

  expect(nextButton).toBeEnabled();
  expect(nextButton).toHaveTextContent('Next');
};

const expectTransactionSelectionStep = (params, nextButton) => {
  expect(params.beginningBalance).toBeDisabled();
  expect(params.beginningDate).toBeDisabled();
  expect(params.endingBalance).toBeDisabled();
  expect(params.endingDate).toBeDisabled();

  expect(nextButton).toBeEnabled();
  expect(nextButton).toHaveTextContent('Previous');
};

test('should default to today and zero balance if no last reconciliation exists', async () => {
  const { mockApi } = render((api) => {
    api.onGet('/api/accounts/9/reconciliations/last').reply(404);
  });

  await waitFor(() => expect(mockApi.history.get).toHaveLength(3));

  const params = getParameterInputs();

  expectParamEntryStep(params, getNextButton());

  expect(params.beginningBalance).toHaveValue('$0.00');
  expect(params.beginningDate).toHaveValue('2021-06-24');
  expect(params.endingBalance).toHaveValue('$0.00');
  expect(params.endingDate).toHaveValue('2021-06-24');
});

test('should use last reconciliation to pre-populate parameters', async () => {
  const { mockApi } = render((api) => {
    api.onGet('/api/accounts/9/reconciliations/last').reply(200, lastReconciliation);
    api.onGet(clearedTransactionsUrl).reply(200, { transactions: [] });
  });

  await waitFor(() => expect(mockApi.history.get).toHaveLength(3));

  const params = getParameterInputs();

  expectParamEntryStep(params, getNextButton());

  expect(params.beginningBalance).toHaveValue('$1,255.03');
  expect(params.beginningDate).toHaveValue('2021-11-04');
  expect(params.endingBalance).toHaveValue('$1,255.03');
  expect(params.endingDate).toHaveValue('2021-12-03');
});

test('should use cleared transactions to pre-populate ending balance', async () => {
  const { history, mockApi } = render((api) => {
    api.onGet('/api/accounts/9/reconciliations/last').reply(200, lastReconciliation);
    api.onGet(clearedTransactionsUrl).reply(200, {
      transactions: [
        { id: 3, amount: -5000 },
        { id: 2, amount: 7000 },
      ],
    });
    api.onGet('/api/accounts/9/unreconciled-transactions?page=0&size=25').reply(200, {
      total: 5,
      transactions: [
        { id: 1, recordedDate: '2021-11-07', payee: 'Vendor A', memo: '', amount: -1000 },
        { id: 2, recordedDate: '2021-11-11', payee: 'Vendor B', memo: '', amount: 7000 },
        { id: 3, recordedDate: '2021-11-17', payee: 'Vendor C', memo: '', amount: -5000 },
        { id: 4, recordedDate: '2021-11-20', payee: 'Vendor D', memo: '', amount: 1500 },
        { id: 5, recordedDate: '2021-11-27', payee: 'Vendor E', memo: '', amount: -2000 },
      ],
    });
    api.onPost('/api/accounts/9/reconciliations').reply(201);
  });

  await waitFor(() => expect(mockApi.history.get).toHaveLength(3));

  const params = getParameterInputs();
  const nextButton = getNextButton();

  expectParamEntryStep(params, nextButton);

  expect(params.beginningBalance).toHaveValue('$1,255.03');
  expect(params.beginningDate).toHaveValue('2021-11-04');
  expect(params.endingBalance).toHaveValue('$1,275.03');
  expect(params.endingDate).toHaveValue('2021-12-03');

  userEvent.click(nextButton);
  await waitFor(() => expect(mockApi.history.get).toHaveLength(4));

  expectTransactionSelectionStep(params, nextButton);

  const checkboxes = screen.queryAllByRole('checkbox');
  expect(checkboxes).toHaveLength(11); // 2 per trn, 1 check-all

  expect(checkboxes[0]).not.toBeChecked(); // check-all
  expect(checkboxes[2]).not.toBeChecked(); // transaction #1
  expect(checkboxes[4]).toBeChecked(); // transaction #2
  expect(checkboxes[6]).toBeChecked(); // transaction #3
  expect(checkboxes[8]).not.toBeChecked(); // transaction #4
  expect(checkboxes[10]).not.toBeChecked(); // transaction #5

  const pagination = queryPagination();
  expect(pagination.nextPage).not.toBeInTheDocument();
  expect(pagination.prevPage).not.toBeInTheDocument();

  const balances = getRunningBalances();
  expect(balances.reconciledBalance).toHaveValue('$1,275.03');
  expect(balances.remainingBalance).toHaveValue('$0.00');

  const createButton = getCreateButton();
  expect(createButton).toBeEnabled();

  // Select a transaction
  userEvent.click(checkboxes[8]);
  await waitFor(() => expect(createButton).toBeDisabled());

  expect(balances.remainingBalance).toHaveValue('-$15.00');

  // Select all
  userEvent.click(checkboxes[0]);
  await waitFor(() => expect(balances.remainingBalance).toHaveValue('$15.00'));

  expect(checkboxes[0]).toBeChecked(); // check-all
  expect(checkboxes[2]).toBeChecked(); // transaction #1
  expect(checkboxes[4]).toBeChecked(); // transaction #2
  expect(checkboxes[6]).toBeChecked(); // transaction #3
  expect(checkboxes[8]).toBeChecked(); // transaction #4
  expect(checkboxes[10]).toBeChecked(); // transaction #5

  // Clear all selections
  userEvent.click(checkboxes[0]);
  await waitFor(() => expect(balances.remainingBalance).toHaveValue('$20.00'));

  expect(checkboxes[0]).not.toBeChecked(); // check-all
  expect(checkboxes[2]).not.toBeChecked(); // transaction #1
  expect(checkboxes[4]).not.toBeChecked(); // transaction #2
  expect(checkboxes[6]).not.toBeChecked(); // transaction #3
  expect(checkboxes[8]).not.toBeChecked(); // transaction #4
  expect(checkboxes[10]).not.toBeChecked(); // transaction #5

  // Select appropriate transactions
  userEvent.click(checkboxes[4]);
  userEvent.click(checkboxes[6]);
  await waitFor(() => expect(balances.remainingBalance).toHaveValue('$0.00'));

  expect(createButton).toBeEnabled();

  userEvent.click(createButton);
  await waitFor(() => expect(mockApi.history.post).toHaveLength(1));
  await waitFor(() => expect(history.location.pathname).toBe('/account/9'));

  expect(JSON.parse(mockApi.history.post[0].data)).toEqual({
    beginningBalance: 125503,
    beginningDate: '2021-11-04',
    endingBalance: 127503,
    endingDate: '2021-12-03',
    transactionIds: [2, 3],
  });
});

test('should use user-entered parameters', async () => {
  const { history, mockApi } = render((api) => {
    api.onGet('/api/accounts/9/reconciliations/last').reply(404);
    api.onGet(clearedTransactionsUrl).reply(200, { transactions: [] });
    api.onGet('/api/accounts/9/unreconciled-transactions?page=0&size=25').reply(200, {
      total: 5,
      transactions: [
        { id: 1, recordedDate: '2021-11-07', payee: 'Vendor A', memo: '', amount: -1000 },
        { id: 2, recordedDate: '2021-11-11', payee: 'Vendor B', memo: '', amount: 7000 },
        { id: 3, recordedDate: '2021-11-17', payee: 'Vendor C', memo: '', amount: -5000 },
        { id: 4, recordedDate: '2021-11-20', payee: 'Vendor D', memo: '', amount: 1500 },
        { id: 5, recordedDate: '2021-11-27', payee: 'Vendor E', memo: '', amount: -2000 },
      ],
    });
    api.onPost('/api/accounts/9/reconciliations').reply(201);
  });

  await waitFor(() => expect(mockApi.history.get).toHaveLength(3));

  const params = getParameterInputs();

  expectParamEntryStep(params, getNextButton());

  expect(params.beginningBalance).toHaveValue('$0.00');
  expect(params.beginningDate).toHaveValue('2021-06-24');
  expect(params.endingBalance).toHaveValue('$0.00');
  expect(params.endingDate).toHaveValue('2021-06-24');

  fireEvent.change(params.beginningDate, { target: { value: '2021-11-01' } });
  fireEvent.change(params.endingDate, { target: { value: '2021-11-30' } });
  fireEvent.change(params.beginningBalance, { target: { value: '$100.00' } });
  fireEvent.change(params.endingBalance, { target: { value: '$160.00' } });

  await waitFor(() => expect(params.beginningBalance).toHaveValue('$100.00'));
  expect(params.beginningDate).toHaveValue('2021-11-01');
  expect(params.endingBalance).toHaveValue('$160.00');
  expect(params.endingDate).toHaveValue('2021-11-30');

  userEvent.click(getNextButton());
  await waitFor(() => expect(screen.queryAllByRole('checkbox')).toHaveLength(11));

  const balances = getRunningBalances();
  expect(balances.reconciledBalance).toHaveValue('$100.00');
  expect(balances.remainingBalance).toHaveValue('$60.00');

  const checkboxes = screen.queryAllByRole('checkbox');

  userEvent.click(checkboxes[1]);
  await waitFor(() => expect(balances.remainingBalance).toHaveValue('$70.00'));

  userEvent.click(checkboxes[3]);
  await waitFor(() => expect(balances.remainingBalance).toHaveValue('$0.00'));

  userEvent.click(getCreateButton());
  await waitFor(() => expect(mockApi.history.post).toHaveLength(1));
  await waitFor(() => expect(history.location.pathname).toBe('/account/9'));

  expect(JSON.parse(mockApi.history.post[0].data)).toEqual({
    beginningBalance: 10000,
    beginningDate: '2021-11-01',
    endingBalance: 16000,
    endingDate: '2021-11-30',
    transactionIds: [1, 2],
  });
});

test('should paginate unreconciled transactions', async () => {
  const { mockApi } = render((api) => {
    api.onGet('/api/accounts/9/reconciliations/last').reply(404);
    api.onGet(clearedTransactionsUrl).reply(200, { transactions: [] });
    api.onGet('/api/accounts/9/unreconciled-transactions?page=0&size=25').reply(200, {
      total: 30,
      transactions: [...Array(25)].map(() => transactionGenerator()),
    });
    api.onGet('/api/accounts/9/unreconciled-transactions?page=1&size=25').reply(200, {
      total: 30,
      transactions: [...Array(5)].map(() => transactionGenerator()),
    });
    api.onPost('/api/accounts/9/reconciliations').reply(201);
  });

  await waitFor(() => expect(mockApi.history.get).toHaveLength(3));

  userEvent.click(getNextButton());
  await waitFor(() => expect(screen.queryAllByRole('checkbox')).toHaveLength(51));

  const pagination = getPagination();

  userEvent.click(pagination.nextPage);
  await waitFor(() => expect(screen.queryAllByRole('checkbox')).toHaveLength(11));

  userEvent.click(pagination.prevPage);
  await waitFor(() => expect(screen.queryAllByRole('checkbox')).toHaveLength(51));
});
