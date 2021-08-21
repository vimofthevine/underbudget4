import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import AnnualExpensesList from './AnnualExpensesList';

const render = (expenses, code = 200) => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet('/api/budgets/5/annual-expenses').reply(code, { expenses });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <AnnualExpensesList budgetId={5} />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should show error message when unable to retrieve expenses', async () => {
  render([], 404);
  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  expect(screen.getByText(/unable to retrieve/i)).toBeInTheDocument();
});

test('should show info message when no expenses exist', async () => {
  const { history } = render([], 200);
  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  expect(screen.getByText(/no expenses/i)).toBeInTheDocument();

  userEvent.click(screen.getByRole('link', { name: /create/i }));
  expect(history.location.pathname).toBe('/create-annual');
});

test('should show annual expenses in list', async () => {
  const expenses = [
    {
      id: 3,
      name: 'First Expense',
      envelopeId: 2,
      amount: 123456,
      details: [],
      testAmount: '$1,234.56',
      testName: 'Category 2:Envelope 2',
    },
    {
      id: 7,
      name: 'Second Expense',
      envelopeId: 3,
      amount: 654321,
      details: [],
      testAmount: '$6,543.21',
      testName: 'Category 2:Envelope 3',
    },
  ];
  render(expenses);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const listItems = screen.queryAllByRole('listitem');
  expect(listItems).toHaveLength(expenses.length);

  expenses.forEach((expense, i) => {
    expect(listItems[i]).toHaveTextContent(expense.name);
    expect(listItems[i]).toHaveTextContent(expense.testAmount);
    expect(listItems[i]).toHaveTextContent(expense.testName);
  });
});

test('should navigate to modify route on button click', async () => {
  const { history } = render([{ id: 3, name: 'My Expense', amount: 123456 }]);
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  userEvent.click(screen.getByRole('button', { name: /My Expense/ }));
  expect(history.location.pathname).toBe('/modify-annual/3');
});

test('should prompt to confirm deletion of expense', async () => {
  const { mockApi, queryClient } = render([{ id: 3, name: 'My Expense', amount: 123456 }]);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
  mockApi.onDelete('/api/budget-annual-expenses/3').reply(204);

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  userEvent.click(screen.getByRole('button', { name: /delete expense/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );

  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  expect(mockApi.history.delete).toHaveLength(0);

  userEvent.click(screen.getByRole('button', { name: /delete expense/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );

  userEvent.click(screen.getByRole('button', { name: /ok/i }));
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(mockApi.history.delete).toHaveLength(1));
  expect(mockApi.history.delete[0].url).toBe('/api/budget-annual-expenses/3');
  expect(invalidateQueries).toHaveBeenCalledWith(['budget-annual-expenses', { budgetId: 5 }]);
});
