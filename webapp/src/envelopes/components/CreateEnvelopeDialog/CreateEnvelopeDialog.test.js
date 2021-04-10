import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import renderWithRouter from '../../../tests/renderWithRouter';
import CreateEnvelopeDialog from './CreateEnvelopeDialog';

const render = () => {
  localStorage.setItem('underbudget.selected.ledger', '2');

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  const mock = new MockAdapter(axios);
  mock.onGet('/api/ledgers/2/envelope-categories').reply(200, {
    categories: [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ],
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <CreateEnvelopeDialog />
      </QueryClientProvider>,
    ),
    mock,
    queryClient,
  };
};

test('should prevent submission when required fields are missing', async () => {
  const { mock } = render();

  expect(screen.getByRole('heading', { name: /create envelope/i })).toBeInTheDocument();
  await waitFor(() => expect(mock.history.get.length).toBe(1));

  const createButton = screen.getByRole('button', { name: /create/i });
  userEvent.click(createButton);

  await waitFor(() => expect(screen.getAllByText(/required/i)).toHaveLength(2));
  expect(createButton).toBeDisabled();
});

test('should show error message when request error', async () => {
  const { mock } = render();
  mock.onPost('/api/envelope-categories/2/envelopes').reply(400);

  expect(screen.getByRole('heading', { name: /create envelope/i })).toBeInTheDocument();
  await waitFor(() => expect(mock.history.get.length).toBe(1));

  userEvent.type(screen.getByLabelText(/^name/i), 'my envelope name');
  userEvent.click(screen.getByRole('button', { name: /open/i }));
  userEvent.click(screen.getByRole('option', { name: 'Category 2' }));
  userEvent.click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() => expect(screen.getByText(/unable to create envelope/i)).toBeInTheDocument());
});

test('should close and refresh query when successful create', async () => {
  const { mock, queryClient } = render();
  mock.onPost('/api/envelope-categories/2/envelopes').reply(201);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  expect(screen.getByRole('heading', { name: /create envelope/i })).toBeInTheDocument();
  await waitFor(() => expect(mock.history.get.length).toBe(1));

  userEvent.type(screen.getByLabelText(/^name/i), 'my envelope name');
  userEvent.click(screen.getByRole('button', { name: /open/i }));
  userEvent.click(screen.getByRole('option', { name: 'Category 2' }));
  userEvent.click(screen.getByRole('button', { name: /create/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /create envelope/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mock.history.post[0].data)).toEqual({
    name: 'my envelope name',
  });
  expect(invalidateQueries).toHaveBeenCalledWith([
    'envelope-categories',
    {
      ledger: '2',
    },
  ]);
});
