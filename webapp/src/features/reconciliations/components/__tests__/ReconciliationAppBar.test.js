import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import renderWithRouter from 'test/renderWithRouter';
import setupMockApi from 'test/setupMockApi';
import ReconciliationAppBar from '../ReconciliationAppBar';

const render = (configureApi = () => 0) => {
  const mockApi = setupMockApi({ delayResponse: 0 });
  configureApi(mockApi);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <ReconciliationAppBar reconciliationId={13} prominent={false} />
      </QueryClientProvider>,
    ),
    mockApi,
    queryClient,
  };
};

test('should display account name and reconciliation dates in title', async () => {
  render((api) => {
    api.onGet('/api/accounts/3').reply(200, { name: 'Account 3' });
    api
      .onGet('/api/reconciliations/13')
      .reply(200, { accountId: 3, beginningDate: '2021-11-02', endingDate: '2021-12-01' });
  });

  expect(screen.getByRole('heading', { name: '...' })).toBeInTheDocument();
  await waitFor(() =>
    expect(
      screen.getByRole('heading', { name: 'Account 3 2021-11-02 - 2021-12-01' }),
    ).toBeInTheDocument(),
  );
});

test('should prompt to confirm deletion of reconciliation', async () => {
  const { history, mockApi, queryClient } = render((api) => {
    api.onGet('/api/accounts/3').reply(200, { name: 'Account 3' });
    api
      .onGet('/api/reconciliations/13')
      .reply(200, { accountId: 3, beginningDate: '2021-11-02', endingDate: '2021-12-01' });
    api.onDelete('/api/reconciliations/13').reply(204);
  });
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  const deleteButton = screen.getByRole('button', { name: /delete reconciliation/i });

  expect(deleteButton).toBeDisabled();
  await waitFor(() => expect(deleteButton).toBeEnabled());

  // Reject cancellation
  userEvent.click(deleteButton);
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /cancel/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  expect(mockApi.history.delete).toHaveLength(0);

  // Confirm cancellation
  userEvent.click(deleteButton);
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /ok/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(mockApi.history.delete).toHaveLength(1));
  expect(mockApi.history.delete[0].url).toBe('/api/reconciliations/13');
  expect(invalidateQueries).toHaveBeenCalledWith(['reconciliations', { accountId: 3 }]);

  await waitFor(() => expect(history.location.pathname).toBe('/account/3/reconciliations'));
});
