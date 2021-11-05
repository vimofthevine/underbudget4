import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import ModifyActiveBudgetDialog from '../ModifyActiveBudgetDialog';

const render = (activeBudget, code = 200) => {
  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet(`/api/active-budgets/${activeBudget.id}`).reply(code, activeBudget);
  mockApi.onGet('/api/ledgers/2/budgets').reply(200, {
    budgets: [
      { id: 1, name: 'Budget 1', periods: 1 },
      { id: 2, name: 'Budget 2', periods: 2 },
    ],
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/budgets/modify-active/:id' element={<ModifyActiveBudgetDialog />} />
        </Routes>
      </QueryClientProvider>,
      { route: `/budgets/modify-active/${activeBudget.id}` },
    ),
    mockApi,
    queryClient,
  };
};

test('should close dialog when unable to fetch budget', async () => {
  const { history } = render({ id: 5 }, 404);
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify active budget/i })).toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: /modify active budget/i }),
    ).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(history.location.pathname).toBe('/budgets'));
});

// Can't unselect a budget, so disable this for now (add back in if a clearable field is introduced)
// test('should prevent submission when required fields are missing', async () => {
//   render({ id: 5, budgetId: 2, year: 2020 });
//   await waitFor(() =>
//     expect(screen.getByRole('textbox', { name: /budget/i })).toHaveValue('Budget 2'),
//   );
//   expect(screen.getByRole('textbox', { name: /year/i })).toHaveValue('2020');
//   expect(screen.getByRole('textbox', { name: /year/i })).toBeDisabled();

//   userEvent.clear(screen.getByRole('textbox', { name: /budget/i }));
//   userEvent.tab();

//   const saveButton = screen.getByRole('button', { name: /save/i });
//   userEvent.click(saveButton);
//   await (await waitFor(() => expect(screen.getByText(/required/i)))).toBeInTheDocument();
//   expect(saveButton).toBeDisabled();
// });

test('should show error message when request error', async () => {
  const { mockApi } = render({ id: 5, budgetId: 2, year: 2020 });
  mockApi.onPut('/api/active-budgets/5').reply(400);

  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /budget/i })).toHaveValue('Budget 2'),
  );
  expect(screen.getByRole('textbox', { name: /year/i })).toHaveValue('2020');
  expect(screen.getByRole('textbox', { name: /year/i })).toBeDisabled();

  userEvent.clear(screen.getByRole('textbox', { name: /budget/i }));
  userEvent.type(screen.getByRole('textbox', { name: /budget/i }), 'Budget 1');

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.getByText(/unable to modify active budget/i)).toBeInTheDocument(),
  );
});

test('should close and refresh query when successful modify', async () => {
  const { mockApi, queryClient } = render({ id: 5, budgetId: 2, name: 'Test Budget', year: 2020 });
  mockApi.onPut('/api/active-budgets/5').reply(200);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: /budget/i })).toHaveValue('Budget 2'),
  );

  userEvent.clear(screen.getByRole('textbox', { name: /budget/i }));
  userEvent.type(screen.getByRole('textbox', { name: /budget/i }), 'Budget 1');

  await waitFor(() => expect(screen.getByRole('button', { name: /save/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: /modify active budget/i }),
    ).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.put[0].data)).toEqual({
    budgetId: 1,
  });
  expect(invalidateQueries).toHaveBeenCalledWith(['active-budget', '5']);
  expect(invalidateQueries).toHaveBeenCalledWith([
    'active-budgets',
    {
      ledger: '2',
    },
  ]);
});
