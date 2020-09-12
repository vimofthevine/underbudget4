import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { ReactQueryCacheProvider, makeQueryCache, setConsole } from 'react-query';

import renderWithRouter from '../../../tests/renderWithRouter';
import { AccountContextProvider } from '../../contexts/account';
import useModifyAccountCategory from '../../hooks/useModifyAccountCategory';
import ModifyAccountCategoryDialog from './ModifyAccountCategoryDialog';

const OpenDialogButton = ({ category }) => (
  <button onClick={useModifyAccountCategory(category)} type='button'>
    Open
  </button>
);

const render = (category) => {
  const queryCache = makeQueryCache();
  return {
    ...renderWithRouter(
      <ReactQueryCacheProvider queryCache={queryCache}>
        <AccountContextProvider>
          <>
            <OpenDialogButton category={category} />
            <ModifyAccountCategoryDialog />
          </>
        </AccountContextProvider>
      </ReactQueryCacheProvider>,
    ),
    queryCache,
  };
};

const openDialog = async () => {
  userEvent.click(screen.getByRole('button', { name: 'Open' }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify category/i })).toBeInTheDocument(),
  );
};

describe('CreateAccountCategoryDialog', () => {
  beforeEach(() => {
    setConsole({
      log: () => 0,
      warn: () => 0,
      error: () => 0,
    });
  });

  it('should prevent submission when required fields are missing', async () => {
    render({ id: 'acct-cat-id', name: 'A category' });
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
    mockAxios.onPatch('/api/account-categories/acct-cat-id').reply(400);

    render({ id: 'acct-cat-id', name: 'A category' });
    await openDialog();

    userEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() =>
      expect(screen.getByText(/unable to modify account category/i)).toBeInTheDocument(),
    );
  });

  it('should close and refresh query when successful modify', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPatch('/api/account-categories/acct-cat-id').reply(200);

    localStorage.setItem('underbudget.selected.ledger', 'ledger-id');

    const { queryCache } = render({ id: 'acct-cat-id', name: 'A category' });
    const refetchQueries = jest.spyOn(queryCache, 'refetchQueries');

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
    expect(refetchQueries).toHaveBeenCalledWith([
      'accountCategories',
      {
        ledger: 'ledger-id',
      },
    ]);
  });
});
