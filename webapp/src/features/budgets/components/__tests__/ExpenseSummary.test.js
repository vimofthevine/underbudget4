import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import ExpenseSummary from '../ExpenseSummary';

const render = (firstPeriod, secondPeriod, code = 200) => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi
    .onGet('/api/budgets/5/budgeted-expenses/0')
    .reply(code, { expensesByEnvelopeId: firstPeriod });
  mockApi
    .onGet('/api/budgets/5/budgeted-expenses/1')
    .reply(code, { expensesByEnvelopeId: secondPeriod });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <ExpenseSummary budgetId={5} periods={2} />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should show error message when unable to retrieve expenses', async () => {
  render({}, {}, 404);
  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  expect(screen.getByText(/unable to retrieve/i)).toBeInTheDocument();
});

test('should show info message when no expenses exist', async () => {
  render({}, {}, 200);
  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  expect(screen.getByText(/no expenses/i)).toBeInTheDocument();
});

test('should show expenses by period', async () => {
  const firstPeriod = {
    1: 123456,
    3: 34000,
  };
  const secondPeriod = {
    1: 123456,
    3: 35000,
    4: 1000,
  };
  render(firstPeriod, secondPeriod);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const firstListItems = screen.queryAllByRole('listitem');
  expect(firstListItems).toHaveLength(2);

  expect(firstListItems[0]).toHaveTextContent('Category 1:Envelope 1');
  expect(firstListItems[0]).toHaveTextContent('$1,234.56');

  expect(firstListItems[1]).toHaveTextContent('Category 2:Envelope 3');
  expect(firstListItems[1]).toHaveTextContent('$340.00');

  userEvent.click(screen.getByRole('button', { name: 'Jan to Jun' }));
  userEvent.click(screen.getAllByRole('option')[1]);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const secondListItems = screen.queryAllByRole('listitem');
  expect(secondListItems).toHaveLength(3);

  expect(secondListItems[0]).toHaveTextContent('Category 1:Envelope 1');
  expect(secondListItems[0]).toHaveTextContent('$1,234.56');

  expect(secondListItems[1]).toHaveTextContent('Category 2:Envelope 3');
  expect(secondListItems[1]).toHaveTextContent('$350.00');

  expect(secondListItems[2]).toHaveTextContent('Category 2:Envelope 4');
  expect(secondListItems[2]).toHaveTextContent('$10.00');
});

test('should navigate to expenses route on arrow button click', async () => {
  const { history } = render({}, {});
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  userEvent.click(screen.getByRole('button', { name: /go to budget expenses/i }));
  expect(history.location.pathname).toBe('/expenses');
});
