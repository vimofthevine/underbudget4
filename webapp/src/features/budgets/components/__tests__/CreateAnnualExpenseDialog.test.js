import { configure, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import CreateAnnualExpenseDialog from '../CreateAnnualExpenseDialog';

const render = () => {
  configure({ defaultHidden: true });

  setSelectedLedger('2');

  const mockApi = setupMockApi({ delayResponse: 0 });
  const queryClient = new QueryClient();

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <CreateAnnualExpenseDialog budgetId={5} periods={4} />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should prevent submission when required fields are missing', async () => {
  render();
  expect(screen.getByRole('heading', { name: /create annual expense/i })).toBeInTheDocument();

  const create = screen.getByRole('button', { name: /create/i });
  userEvent.click(create);

  await waitFor(() => expect(screen.getAllByText(/required/i)).toHaveLength(2));
  expect(create).toBeDisabled();
});

test('should show error message when request error', async () => {
  const { mockApi } = render();
  mockApi.onPost('/api/budgets/5/annual-expenses').reply(400);
  await waitFor(() => expect(mockApi.history.get.length).toBe(2));

  expect(screen.getByRole('heading', { name: /create annual expense/i })).toBeInTheDocument();

  userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'my expense name');
  userEvent.type(screen.getByRole('textbox', { name: /envelope/i }), 'Category 2:Envelope 3');
  fireEvent.change(screen.getByRole('textbox', { name: /amount/i }), {
    target: { value: '$12.34' },
  });
  await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeEnabled());

  userEvent.click(screen.getByRole('button', { name: /create/i }));
  await waitFor(() =>
    expect(screen.getByText(/unable to create annual expense/i)).toBeInTheDocument(),
  );
});

test('should close and refresh query when successful create', async () => {
  const { mockApi, queryClient } = render();
  mockApi.onPost('/api/budgets/5/annual-expenses').reply(201);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
  await waitFor(() => expect(mockApi.history.get.length).toBe(2));

  expect(screen.getByRole('heading', { name: /create annual expense/i })).toBeInTheDocument();

  userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'my expense name');
  userEvent.type(screen.getByRole('textbox', { name: /envelope/i }), 'Category 2:Envelope 3');
  fireEvent.change(screen.getByRole('textbox', { name: /amount/i }), {
    target: { value: '$12.34' },
  });

  await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: /create annual expense/i }),
    ).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockApi.history.post[0].data)).toEqual({
    name: 'my expense name',
    envelopeId: 3,
    amount: 1234,
    details: [],
  });
  expect(invalidateQueries).toHaveBeenCalledWith(['budget-annual-expenses', { budgetId: 5 }]);
});

test('should allow period detail amounts to be input', async () => {
  const { mockApi } = render();
  mockApi.onPost('/api/budgets/5/annual-expenses').reply(500);
  await waitFor(() => expect(mockApi.history.get.length).toBe(2));

  expect(screen.getByRole('heading', { name: /create annual expense/i })).toBeInTheDocument();

  userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'my expense name');
  userEvent.type(screen.getByRole('textbox', { name: /envelope/i }), 'Category 2:Envelope 3');
  userEvent.click(screen.getByRole('checkbox', { name: /use period-specific amounts/i }));

  // Make sure total amount is disabled
  let amounts = screen.getAllByRole('textbox', { name: /amount/i });
  expect(amounts).toHaveLength(5);
  expect(amounts[0]).toBeDisabled();

  // Enter in detailed amounts and verify that total amount is updated
  fireEvent.change(amounts[1], { target: { value: '$110.00' } });
  fireEvent.change(amounts[3], { target: { value: '$90.00' } });
  expect(amounts[0]).toHaveDisplayValue('$200.00');

  await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /create/i }));
  await waitFor(() => expect(mockApi.history.post).toHaveLength(1));
  expect(JSON.parse(mockApi.history.post[0].data)).toEqual({
    name: 'my expense name',
    envelopeId: 3,
    amount: 20000,
    details: [
      { name: '', amount: 11000 },
      { name: '', amount: 0 },
      { name: '', amount: 9000 },
      { name: '', amount: 0 },
    ],
  });

  // Revert back to simple and verify that total amount is enabled
  userEvent.click(screen.getByRole('checkbox', { name: /use period-specific amounts/i }));
  amounts = screen.getAllByRole('textbox', { name: /amount/i });
  expect(amounts).toHaveLength(1);
  expect(amounts[0]).toBeEnabled();
  expect(amounts[0]).toHaveDisplayValue('$200.00');

  await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /create/i }));
  await waitFor(() => expect(mockApi.history.post).toHaveLength(2));
  expect(JSON.parse(mockApi.history.post[1].data)).toEqual({
    name: 'my expense name',
    envelopeId: 3,
    amount: 20000,
    details: [],
  });

  // Go back to detailed and verify that total was split among periods
  userEvent.click(screen.getByRole('checkbox', { name: /use period-specific amounts/i }));
  amounts = screen.getAllByRole('textbox', { name: /amount/i });
  expect(amounts).toHaveLength(5);
  expect(amounts[1]).toHaveDisplayValue('$50.00');
  expect(amounts[2]).toHaveDisplayValue('$50.00');
  expect(amounts[3]).toHaveDisplayValue('$50.00');
  expect(amounts[4]).toHaveDisplayValue('$50.00');
  fireEvent.change(amounts[2], { target: { value: '$70.00' } });
  userEvent.type(screen.getByRole('textbox', { name: /oct to dec/i }), 'Last Quarter');

  await waitFor(() => expect(screen.getByRole('button', { name: /create/i })).toBeEnabled());
  userEvent.click(screen.getByRole('button', { name: /create/i }));
  await waitFor(() => expect(mockApi.history.post).toHaveLength(2));
  expect(JSON.parse(mockApi.history.post[2].data)).toEqual({
    name: 'my expense name',
    envelopeId: 3,
    amount: 22000,
    details: [
      { name: '', amount: 5000 },
      { name: '', amount: 7000 },
      { name: '', amount: 5000 },
      { name: 'Last Quarter', amount: 5000 },
    ],
  });
}, 30000);
