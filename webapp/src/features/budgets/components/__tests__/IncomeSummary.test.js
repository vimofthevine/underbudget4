import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import IncomeSummary from '../IncomeSummary';

const render = (incomes, code = 200) => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet('/api/budgets/5/periodic-incomes').reply(code, { incomes });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <IncomeSummary budgetId={5} />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should show error message when unable to retrieve incomes', async () => {
  render([], 404);
  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  expect(screen.getByText(/unable to retrieve/i)).toBeInTheDocument();
});

test('should show info message when no incomes exist', async () => {
  render([], 200);
  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  expect(screen.getByText(/no incomes/i)).toBeInTheDocument();
});

test('should show periodic incomes in summary', async () => {
  const incomes = [
    { id: 3, name: 'First Income', amount: 123456, testAmount: '$1,234.56' },
    { id: 7, name: 'Second Income', amount: 654321, testAmount: '$6,543.21' },
  ];
  render(incomes);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  const listItems = screen.queryAllByRole('listitem');
  expect(listItems).toHaveLength(incomes.length);

  incomes.forEach((income, i) => {
    expect(listItems[i]).toHaveTextContent(income.name);
    expect(listItems[i]).toHaveTextContent(income.testAmount);
  });
});

test('should navigate to incomes route on button click', async () => {
  const { history } = render([]);
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  userEvent.click(screen.getByRole('button', { name: /go to budget incomes/i }));
  expect(history.location.pathname).toBe('/incomes');
});
