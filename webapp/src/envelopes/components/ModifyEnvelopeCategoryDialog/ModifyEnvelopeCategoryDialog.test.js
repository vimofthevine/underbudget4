import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import renderWithRouter from '../../../tests/renderWithRouter';
import { EnvelopeContextProvider } from '../../contexts/envelope';
import useModifyEnvelopeCategory from '../../hooks/useModifyEnvelopeCategory';
import ModifyEnvelopeCategoryDialog from './ModifyEnvelopeCategoryDialog';

const OpenDialogButton = ({ category }) => (
  <button onClick={useModifyEnvelopeCategory(category)} type='button'>
    Open
  </button>
);

const render = (category) => {
  const queryClient = new QueryClient();
  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <EnvelopeContextProvider>
          <>
            <OpenDialogButton category={category} />
            <ModifyEnvelopeCategoryDialog />
          </>
        </EnvelopeContextProvider>
      </QueryClientProvider>,
    ),
    queryClient,
  };
};

const openDialog = async () => {
  userEvent.click(screen.getByRole('button', { name: 'Open' }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify category/i })).toBeInTheDocument(),
  );
};

describe('CreateEnvelopeCategoryDialog', () => {
  it('should prevent submission when required fields are missing', async () => {
    render({ id: 'env-cat-id', name: 'A category' });
    await openDialog();

    expect(screen.getByLabelText(/name/i)).toHaveValue('A category');

    userEvent.clear(screen.getByLabelText(/name/i));

    const saveButton = screen.getByRole('button', { name: /save/i });
    userEvent.click(saveButton);
    await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());

    expect(saveButton).toBeDisabled();
  });

  it('should show error message when request error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPatch('/api/envelope-categories/env-cat-id').reply(400);

    render({ id: 'env-cat-id', name: 'A category' });
    await openDialog();

    userEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() =>
      expect(screen.getByText(/unable to modify envelope category/i)).toBeInTheDocument(),
    );
  });

  it('should close and refresh query when successful modify', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPatch('/api/envelope-categories/env-cat-id').reply(200);

    localStorage.setItem('underbudget.selected.ledger', 'ledger-id');

    const { queryClient } = render({ id: 'env-cat-id', name: 'A category' });
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

    await openDialog();

    userEvent.clear(screen.getByLabelText(/name/i));
    await userEvent.type(screen.getByLabelText(/name/i), 'my category name');
    userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /modify category/i })).not.toBeInTheDocument(),
    );
    expect(JSON.parse(mockAxios.history.patch[0].data)).toEqual({
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
