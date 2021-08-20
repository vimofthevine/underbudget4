import { configure, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import ModifyAnnualExpenseDialog from './ModifyAnnualExpenseDialog';

const render = (expense, { get = 200, put = 200 } = {}) => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet(`/api/budget-annual-expenses/${expense.id}`).reply(get, expense);
  mockApi.onPut(`/api/budget-annual-expenses/${expense.id}`).reply(put);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path='/expenses/:id/modify-annual/:expenseId'
            element={<ModifyAnnualExpenseDialog budgetId='5' periods={4} />}
          />
        </Routes>
      </QueryClientProvider>,
      { route: `/expenses/5/modify-annual/${expense.id}` },
    ),
    invalidateQueries,
    mockApi,
    queryClient,
  };
};

test('should close dialog when unable to fetch expense', async () => {
  const { history } = render({ id: 8 }, { get: 404 });
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify annual expense/i })).toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: /modify annual expense/i }),
    ).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(history.location.pathname).toBe('/expenses/5'));
});

test('should prevent submission when required fields are missing', async () => {
  render({ id: 8, name: 'Test Expense', envelopeId: 3, amount: 1234, details: [] });
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Test Expense'),
  );
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /envelope/i })).toHaveValue('Category 2:Envelope 3'),
  );
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /amount/i })).toHaveValue('$12.34'),
  );

  userEvent.clear(screen.getByRole('textbox', { name: /name/i }));
  userEvent.tab();

  const saveButton = screen.getByRole('button', { name: /save/i });
  userEvent.click(saveButton);
  await (await waitFor(() => expect(screen.getByText(/required/i)))).toBeInTheDocument();
  expect(saveButton).toBeDisabled();
});

test('should show error message when request error', async () => {
  render({ id: 8, name: 'Test Expense', envelopeId: 3, amount: 1234, details: [] }, { put: 400 });
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Test Expense'),
  );
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /envelope/i })).toHaveValue('Category 2:Envelope 3'),
  );
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /amount/i })).toHaveValue('$12.34'),
  );

  userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'mod');
  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.getByText(/unable to modify annual expense/i)).toBeInTheDocument(),
  );
});

test('should close and refresh query when successful modify', async () => {
  const { invalidateQueries, mockApi } = render({
    id: 8,
    name: 'Test Expense',
    envelopeId: 3,
    amount: 1234,
    details: [],
  });
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Test Expense'),
  );
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /envelope/i })).toHaveValue('Category 2:Envelope 3'),
  );
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /amount/i })).toHaveValue('$12.34'),
  );

  userEvent.type(screen.getByRole('textbox', { name: /name/i }), '{selectall}Expense Name');
  userEvent.type(
    screen.getByRole('textbox', { name: /envelope/i }),
    '{selectall}Category 2:Envelope 4',
  );
  fireEvent.change(screen.getByRole('textbox', { name: /amount/i }), {
    target: { value: '$1,406.27' },
  });

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: /modify annual expense/i }),
    ).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.put[0].data)).toEqual({
    name: 'Expense Name',
    envelopeId: 4,
    amount: 140627,
    details: [],
  });
  expect(invalidateQueries).toHaveBeenCalledWith(['budget-annual-expense', '8']);
  expect(invalidateQueries).toHaveBeenCalledWith([
    'budget-annual-expenses',
    {
      budgetId: '5',
    },
  ]);
});

test('should allow period details to be added', async () => {
  const { mockApi } = render({
    id: 8,
    name: 'Test Expense',
    envelopeId: 3,
    amount: 10000,
    details: [],
  });
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Test Expense'),
  );
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /envelope/i })).toHaveValue('Category 2:Envelope 3'),
  );
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /amount/i })).toHaveValue('$100.00'),
  );

  userEvent.click(screen.getByRole('checkbox', { name: /use period-specific amounts/i }));
  await waitFor(() => expect(screen.getAllByRole('textbox', { name: /amount/i })).toHaveLength(5));

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() => expect(mockApi.history.put).toHaveLength(1));
  expect(JSON.parse(mockApi.history.put[0].data)).toEqual({
    name: 'Test Expense',
    envelopeId: 3,
    amount: 10000,
    details: [
      { name: '', amount: 2500 },
      { name: '', amount: 2500 },
      { name: '', amount: 2500 },
      { name: '', amount: 2500 },
    ],
  });
});

test('should allow period details to be modified', async () => {
  const { mockApi } = render({
    id: 8,
    name: 'Test Expense',
    envelopeId: 3,
    amount: 4600,
    details: [
      { name: 'First', amount: 1000 },
      { name: 'Second', amount: 1200 },
      { name: '', amount: 1100 },
      { name: 'Last', amount: 1300 },
    ],
  });
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Test Expense'),
  );
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /envelope/i })).toHaveValue('Category 2:Envelope 3'),
  );
  await waitFor(() =>
    expect(screen.getAllByRole('textbox', { name: /amount/i })[0]).toHaveValue('$46.00'),
  );

  expect(screen.getByRole('checkbox', { name: /use period-specific amounts/i })).toBeDisabled();
  const amounts = screen.getAllByRole('textbox', { name: /amount/i });
  expect(amounts).toHaveLength(5);
  fireEvent.change(amounts[3], { target: { value: '$110.00' } });

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() => expect(mockApi.history.put).toHaveLength(1));
  expect(JSON.parse(mockApi.history.put[0].data)).toEqual({
    name: 'Test Expense',
    envelopeId: 3,
    amount: 14500,
    details: [
      { name: 'First', amount: 1000 },
      { name: 'Second', amount: 1200 },
      { name: '', amount: 11000 },
      { name: 'Last', amount: 1300 },
    ],
  });
});
