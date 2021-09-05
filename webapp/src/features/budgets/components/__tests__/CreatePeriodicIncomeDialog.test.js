import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import CreatePeriodicIncomeDialog from '../CreatePeriodicIncomeDialog';

const render = () => {
  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  const queryClient = new QueryClient();

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <CreatePeriodicIncomeDialog budgetId={5} />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should prevent submission when required fields are missing', async () => {
  render();
  expect(screen.getByRole('heading', { name: /create periodic income/i })).toBeInTheDocument();

  const create = screen.getByRole('button', { name: /create/i });
  userEvent.click(create);

  await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());
  expect(create).toBeDisabled();
});

test('should show error message when request error', async () => {
  const { mockApi } = render();
  mockApi.onPost('/api/budgets/5/periodic-incomes').reply(400);
  await waitFor(() => expect(mockApi.history.get.length).toBe(1));

  expect(screen.getByRole('heading', { name: /create periodic income/i })).toBeInTheDocument();

  userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'my income name');
  fireEvent.change(screen.getByRole('textbox', { name: /amount/i }), {
    target: { value: '$12.34' },
  });
  await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeEnabled());

  userEvent.click(screen.getByRole('button', { name: /create/i }));
  await waitFor(() =>
    expect(screen.getByText(/unable to create periodic income/i)).toBeInTheDocument(),
  );
});

test('should close and refresh query when successful create', async () => {
  const { mockApi, queryClient } = render();
  mockApi.onPost('/api/budgets/5/periodic-incomes').reply(201);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
  await waitFor(() => expect(mockApi.history.get.length).toBe(1));

  expect(screen.getByRole('heading', { name: /create periodic income/i })).toBeInTheDocument();

  userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'my income name');
  fireEvent.change(screen.getByRole('textbox', { name: /amount/i }), {
    target: { value: '$12.34' },
  });

  await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: /create periodic income/i }),
    ).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.post[0].data)).toEqual({
    name: 'my income name',
    amount: 1234,
  });
  expect(invalidateQueries).toHaveBeenCalledWith(['budget-periodic-incomes', { budgetId: 5 }]);
});
