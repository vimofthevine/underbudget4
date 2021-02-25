import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import renderWithRouter from '../../../tests/renderWithRouter';
import { EnvelopeContextProvider } from '../../contexts/envelope';
import useCreateEnvelope from '../../hooks/useCreateEnvelope';
import CreateEnvelopeDialog from './CreateEnvelopeDialog';

const OpenDialogButton = () => (
  <button onClick={useCreateEnvelope()} type='button'>
    Open
  </button>
);

const render = () => {
  localStorage.setItem('underbudget.selected.ledger', 'ledger-id');

  const mock = new MockAdapter(axios);
  mock
    .onGet('/api/ledgers/ledger-id/envelopeCategories?projection=categoryWithEnvelopes')
    .reply(200, {
      _embedded: {
        envelopeCategories: [
          { id: 'cat-id-1', name: 'Category 1' },
          { id: 'cat-id-2', name: 'Category 2' },
        ],
      },
    });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <EnvelopeContextProvider>
          <>
            <OpenDialogButton />
            <CreateEnvelopeDialog />
          </>
        </EnvelopeContextProvider>
      </QueryClientProvider>,
    ),
    mock,
    queryClient,
  };
};

describe('CreateEnvelopeDialog', () => {
  it('should prevent submission when required fields are missing', async () => {
    const { mock } = render();

    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create envelope/i })).toBeInTheDocument(),
    );
    await waitFor(() => expect(mock.history.get.length).toBe(1));

    const createButton = screen.getByRole('button', { name: /create/i });
    userEvent.click(createButton);
    await waitFor(() => expect(screen.getAllByText(/required/i)).toHaveLength(2));

    expect(createButton).toBeDisabled();
  });

  it('should show error message when request error', async () => {
    const { mock } = render();
    mock.onPost('/api/envelopes').reply(400);

    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create envelope/i })).toBeInTheDocument(),
    );
    await waitFor(() => expect(mock.history.get.length).toBe(1));

    await userEvent.type(screen.getByLabelText(/^name/i), 'my envelope name');
    userEvent.click(screen.getByRole('button', { name: /open/i }));
    userEvent.click(screen.getByRole('option', { name: 'Category 2' }));
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => expect(screen.getByText(/unable to create envelope/i)).toBeInTheDocument());
  });

  it('should close and refresh query when successful create', async () => {
    const { mock, queryClient } = render();
    mock.onPost('/api/envelopes').reply(201);
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create envelope/i })).toBeInTheDocument(),
    );
    await waitFor(() => expect(mock.history.get.length).toBe(1));

    await userEvent.type(screen.getByLabelText(/^name/i), 'my envelope name');
    userEvent.click(screen.getByRole('button', { name: /open/i }));
    userEvent.click(screen.getByRole('option', { name: 'Category 2' }));
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /create envelope/i })).not.toBeInTheDocument(),
    );
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      category: '/api/envelope-categories/cat-id-2',
      name: 'my envelope name',
    });
    expect(invalidateQueries).toHaveBeenCalledWith([
      'envelopeCategories',
      {
        ledger: 'ledger-id',
      },
    ]);
  });

  it('should send all populated fields', async () => {
    const { mock } = render();
    mock.onPost('/api/envelopes').reply(201);

    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create envelope/i })).toBeInTheDocument(),
    );
    await waitFor(() => expect(mock.history.get.length).toBe(1));

    await userEvent.type(screen.getByLabelText(/^name/i), 'my envelope name');
    userEvent.click(screen.getByRole('button', { name: /open/i }));
    userEvent.click(screen.getByRole('option', { name: 'Category 2' }));
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /create envelope/i })).not.toBeInTheDocument(),
    );
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      category: '/api/envelope-categories/cat-id-2',
      name: 'my envelope name',
    });
  });
});
