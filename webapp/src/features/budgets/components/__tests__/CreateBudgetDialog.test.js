import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import CreateBudgetDialog from '../CreateBudgetDialog';

const render = () => {
  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  const queryClient = new QueryClient();

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <CreateBudgetDialog />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should prevent submission when required fields are missing', async () => {
  render();
  expect(screen.getByRole('heading', { name: /create budget/i })).toBeInTheDocument();

  const create = screen.getByRole('button', { name: /create/i });
  userEvent.click(create);

  await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());
  expect(create).toBeDisabled();
});

test('should show error message when request error', async () => {
  const { mockApi } = render();
  mockApi.onPost('/api/ledgers/2/budgets').reply(400);

  expect(screen.getByRole('heading', { name: /create budget/i })).toBeInTheDocument();

  userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'my budget name');
  userEvent.click(screen.getByRole('button', { name: /create/i }));
  await waitFor(() => expect(screen.getByText(/unable to create budget/i)).toBeInTheDocument());
});

test('should close and refresh query when successful create', async () => {
  const { mockApi, queryClient } = render();
  mockApi.onPost('/api/ledgers/2/budgets').reply(201);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  expect(screen.getByRole('heading', { name: /create budget/i })).toBeInTheDocument();

  userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'my budget name');
  userEvent.click(screen.getByRole('button', { name: /monthly \(12\)/i }));
  userEvent.click(screen.getByRole('option', { name: /biweekly \(26\)/i }));
  userEvent.click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /create budget/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.post[0].data)).toEqual({
    name: 'my budget name',
    periods: 26,
  });
  expect(invalidateQueries).toHaveBeenCalledWith(['budgets', { ledger: '2' }]);
});
