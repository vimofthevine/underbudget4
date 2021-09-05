import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import PeriodicIncomesList from '../PeriodicIncomesList';

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
        <PeriodicIncomesList budgetId={5} />
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
  const { history } = render([], 200);
  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  expect(screen.getByText(/no incomes/i)).toBeInTheDocument();

  userEvent.click(screen.getByRole('link', { name: /create/i }));
  expect(history.location.pathname).toBe('/create-periodic');
});

test('should show periodic incomes in list', async () => {
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

test('should navigate to modify route on button click', async () => {
  const { history } = render([{ id: 3, name: 'My Income', amount: 123456 }]);
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  userEvent.click(screen.getByRole('button', { name: /My Income/ }));
  expect(history.location.pathname).toBe('/modify-periodic/3');
});

test('should prompt to confirm deletion of income', async () => {
  const { mockApi, queryClient } = render([{ id: 3, name: 'My Income', amount: 123456 }]);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
  mockApi.onDelete('/api/budget-periodic-incomes/3').reply(204);

  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

  userEvent.click(screen.getByRole('button', { name: /delete income/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );

  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  expect(mockApi.history.delete).toHaveLength(0);

  userEvent.click(screen.getByRole('button', { name: /delete income/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );

  userEvent.click(screen.getByRole('button', { name: /ok/i }));
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(mockApi.history.delete).toHaveLength(1));
  expect(mockApi.history.delete[0].url).toBe('/api/budget-periodic-incomes/3');
  expect(invalidateQueries).toHaveBeenCalledWith(['budget-periodic-incomes', { budgetId: 5 }]);
});
