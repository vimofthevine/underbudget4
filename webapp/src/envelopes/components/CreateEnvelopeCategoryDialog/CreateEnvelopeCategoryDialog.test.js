import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { ReactQueryCacheProvider, makeQueryCache, setConsole } from 'react-query';

import renderWithRouter from '../../../tests/renderWithRouter';
import { EnvelopeContextProvider } from '../../contexts/envelope';
import useCreateEnvelopeCategory from '../../hooks/useCreateEnvelopeCategory';
import CreateEnvelopeCategoryDialog from './CreateEnvelopeCategoryDialog';

const OpenDialogButton = () => (
  <button onClick={useCreateEnvelopeCategory()} type='button'>
    Open
  </button>
);

const render = () => {
  const queryCache = makeQueryCache();
  return {
    ...renderWithRouter(
      <ReactQueryCacheProvider queryCache={queryCache}>
        <EnvelopeContextProvider>
          <>
            <OpenDialogButton />
            <CreateEnvelopeCategoryDialog />
          </>
        </EnvelopeContextProvider>
      </ReactQueryCacheProvider>,
    ),
    queryCache,
  };
};

describe('CreateEnvelopeCategoryDialog', () => {
  beforeEach(() => {
    setConsole({
      log: () => 0,
      warn: () => 0,
      error: () => 0,
    });
  });

  it('should prevent submission when required fields are missing', async () => {
    render();

    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create category/i })).toBeInTheDocument(),
    );

    const createButton = screen.getByRole('button', { name: /create/i });
    userEvent.click(createButton);
    await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());

    expect(createButton).toBeDisabled();
  });

  it('should show error message when request error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/envelope-categories').reply(400);

    render();

    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create category/i })).toBeInTheDocument(),
    );

    await userEvent.type(screen.getByLabelText(/name/i), 'my category name');
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(screen.getByText(/unable to create envelope category/i)).toBeInTheDocument(),
    );
  });

  it('should close and refresh query when successful create', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/envelope-categories').reply(201);

    localStorage.setItem('underbudget.selected.ledger', 'ledger-id');

    const { queryCache } = render();
    const invalidateQueries = jest.spyOn(queryCache, 'invalidateQueries');

    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /create category/i })).toBeInTheDocument(),
    );

    await userEvent.type(screen.getByLabelText(/name/i), 'my category name');
    userEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /create category/i })).not.toBeInTheDocument(),
    );
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      ledger: '/api/ledgers/ledger-id',
      name: 'my category name',
    });
    expect(invalidateQueries).toHaveBeenCalledWith([
      'envelopeCategories',
      {
        ledger: 'ledger-id',
      },
    ]);
  });
});
