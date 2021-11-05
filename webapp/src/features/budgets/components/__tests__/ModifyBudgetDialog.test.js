import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import ModifyBudgetDialog from '../ModifyBudgetDialog';

const render = (budget, code = 200) => {
  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet(`/api/budgets/${budget.id}`).reply(code, budget);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/budget/:id/modify' element={<ModifyBudgetDialog />} />
        </Routes>
      </QueryClientProvider>,
      { route: `/budget/${budget.id}/modify` },
    ),
    mockApi,
    queryClient,
  };
};

test('should close dialog when unable to fetch budget', async () => {
  const { history } = render({ id: 8 }, 404);
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify budget/i })).toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify budget/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(history.location.pathname).toBe('/budget/8'));
});

test('should prevent submission when required fields are missing', async () => {
  render({ id: 8, name: 'Test Budget', periods: 12 });
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Test Budget'),
  );
  expect(screen.getByRole('button', { name: /monthly \(12\)/i })).toBeInTheDocument();

  userEvent.clear(screen.getByRole('textbox', { name: /name/i }));

  const saveButton = screen.getByRole('button', { name: /save/i });
  userEvent.click(saveButton);
  await (await waitFor(() => expect(screen.getByText(/required/i)))).toBeInTheDocument();
  expect(saveButton).toBeDisabled();
});

test('should show error message when request error', async () => {
  const { mockApi } = render({ id: 8, name: 'Test Budget', periods: 24 });
  mockApi.onPut('/api/budgets/8').reply(400);

  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Test Budget'),
  );
  expect(screen.getByRole('button', { name: /semimonthly \(24\)/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() => expect(screen.getByText(/unable to modify budget/i)).toBeInTheDocument());
});

test('should close and refresh query when successful modify', async () => {
  const { mockApi, queryClient } = render({ id: 8, name: 'Test Budget', periods: 12 });
  mockApi.onPut('/api/budgets/8').reply(200);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Test Budget'),
  );

  userEvent.type(screen.getByRole('textbox', { name: /name/i }), '{selectall}Budget Name');
  userEvent.click(screen.getByRole('button', { name: /monthly \(12\)/i }));
  userEvent.click(screen.getByRole('option', { name: /biweekly \(26\)/i }));

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify budget/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.put[0].data)).toEqual({
    name: 'Budget Name',
    periods: 26,
  });
  expect(invalidateQueries).toHaveBeenCalledWith(['budget', '8']);
  expect(invalidateQueries).toHaveBeenCalledWith([
    'budgets',
    {
      ledger: '2',
    },
  ]);
});
