import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import CreatePeriodicExpenseDialog from './CreatePeriodicExpenseDialog';

const render = () => {
  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  const queryClient = new QueryClient();

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <CreatePeriodicExpenseDialog budgetId={5} />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should prevent submission when required fields are missing', async () => {
  render();
  expect(screen.getByRole('heading', { name: /create periodic expense/i })).toBeInTheDocument();

  const create = screen.getByRole('button', { name: /create/i });
  userEvent.click(create);

  await waitFor(() => expect(screen.getAllByText(/required/i)).toHaveLength(2));
  expect(create).toBeDisabled();
});

test('should show error message when request error', async () => {
  const { mockApi } = render();
  mockApi.onPost('/api/budgets/5/periodic-expenses').reply(400);
  await waitFor(() => expect(mockApi.history.get.length).toBe(2));

  expect(screen.getByRole('heading', { name: /create periodic expense/i })).toBeInTheDocument();

  userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'my expense name');
  userEvent.type(screen.getByRole('textbox', { name: /envelope/i }), 'Category 2:Envelope 3');
  fireEvent.change(screen.getByRole('textbox', { name: /amount/i }), {
    target: { value: '$12.34' },
  });
  await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeEnabled());

  userEvent.click(screen.getByRole('button', { name: /create/i }));
  await waitFor(() =>
    expect(screen.getByText(/unable to create periodic expense/i)).toBeInTheDocument(),
  );
});

test('should close and refresh query when successful create', async () => {
  const { mockApi, queryClient } = render();
  mockApi.onPost('/api/budgets/5/periodic-expenses').reply(201);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
  await waitFor(() => expect(mockApi.history.get.length).toBe(2));

  expect(screen.getByRole('heading', { name: /create periodic expense/i })).toBeInTheDocument();

  userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'my expense name');
  userEvent.type(screen.getByRole('textbox', { name: /envelope/i }), 'Category 2:Envelope 3');
  fireEvent.change(screen.getByRole('textbox', { name: /amount/i }), {
    target: { value: '$12.34' },
  });

  await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: /create periodic expense/i }),
    ).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.post[0].data)).toEqual({
    name: 'my expense name',
    envelopeId: 3,
    amount: 1234,
  });
  expect(invalidateQueries).toHaveBeenCalledWith(['budget-periodic-expenses', { budgetId: 5 }]);
});
