import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import ModifyPeriodicExpenseDialog from '../ModifyPeriodicExpenseDialog';

const render = (expense, { get = 200, put = 200 } = {}) => {
  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet(`/api/budget-periodic-expenses/${expense.id}`).reply(get, expense);
  mockApi.onPut(`/api/budget-periodic-expenses/${expense.id}`).reply(put);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            path='/expenses/:id/modify-periodic/:expenseId'
            element={<ModifyPeriodicExpenseDialog budgetId='5' />}
          />
        </Routes>
      </QueryClientProvider>,
      { route: `/expenses/5/modify-periodic/${expense.id}` },
    ),
    invalidateQueries,
    mockApi,
    queryClient,
  };
};

test('should close dialog when unable to fetch expense', async () => {
  const { history } = render({ id: 8 }, { get: 404 });
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify periodic expense/i })).toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: /modify periodic expense/i }),
    ).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(history.location.pathname).toBe('/expenses/5'));
});

test('should prevent submission when required fields are missing', async () => {
  render({ id: 8, name: 'Test Expense', envelopeId: 3, amount: 1234 });
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
  render({ id: 8, name: 'Test Expense', envelopeId: 3, amount: 1234 }, { put: 400 });
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
    expect(screen.getByText(/unable to modify periodic expense/i)).toBeInTheDocument(),
  );
});

test('should close and refresh query when successful modify', async () => {
  const { invalidateQueries, mockApi } = render({
    id: 8,
    name: 'Test Expense',
    envelopeId: 3,
    amount: 1234,
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
      screen.queryByRole('heading', { name: /modify periodic expense/i }),
    ).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.put[0].data)).toEqual({
    name: 'Expense Name',
    envelopeId: 4,
    amount: 140627,
  });
  expect(invalidateQueries).toHaveBeenCalledWith(['budget-periodic-expense', '8']);
  expect(invalidateQueries).toHaveBeenCalledWith([
    'budget-periodic-expenses',
    {
      budgetId: '5',
    },
  ]);
});
