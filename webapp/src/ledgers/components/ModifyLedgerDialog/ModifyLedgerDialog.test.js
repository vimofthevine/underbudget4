import { fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { ReactQueryCacheProvider, makeQueryCache, setConsole } from 'react-query';

import renderWithRouter from '../../../tests/renderWithRouter';
import LedgerActions from '../LedgerActions';
import { LedgersContextProvider } from '../LedgersContext';
import ModifyLedgerDialog from './ModifyLedgerDialog';

const render = (ledger) => {
  const queryCache = makeQueryCache();
  return {
    ...renderWithRouter(
      <ReactQueryCacheProvider queryCache={queryCache}>
        <LedgersContextProvider>
          <>
            <LedgerActions ledger={ledger} />
            <ModifyLedgerDialog />
          </>
        </LedgersContextProvider>
        ,
      </ReactQueryCacheProvider>,
    ),
    queryCache,
  };
};

const openDialog = async () => {
  fireEvent.click(screen.getByRole('button', { name: /modify ledger/i }));
  await waitFor(() => expect(screen.getByRole('heading', { name: /modify ledger/i })));
};

describe('ModifyLedgerDialog', () => {
  beforeEach(() => {
    setConsole({
      log: () => 0,
      warn: () => 0,
      error: () => 0,
    });
  });

  it('should prevent submission when required fields are missing', async () => {
    render({ id: 'ledger-id', name: 'A ledger', currency: 980 });
    await openDialog();

    expect(screen.getByLabelText(/name/i)).toHaveValue('A ledger');
    expect(screen.getByLabelText(/currency/i)).toHaveValue('UAH');

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: '' },
    });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());

    expect(saveButton).toBeDisabled();
  });

  it('should show error message when error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPut('/api/ledgers/ledger-id').reply(400);

    render({ id: 'ledger-id', name: 'A ledger', currency: 978 });
    await openDialog();

    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(screen.getByText(/unable to modify ledger/i)).toBeInTheDocument());
  });

  it('should close and refresh query when successful modify', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPut('/api/ledgers/ledger-id').reply(200);

    const { queryCache } = render({ id: 'ledger-id', name: 'A ledger', currency: 978 });
    const invalidateQueries = jest.spyOn(queryCache, 'invalidateQueries');

    await openDialog();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'my ledger' },
    });
    fireEvent.change(screen.getByLabelText(/currency/i), {
      target: { value: 'USD' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: /modify ledger/i })).not.toBeInTheDocument(),
    );
    expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
      name: 'my ledger',
      currency: 840,
    });
    expect(invalidateQueries).toHaveBeenCalledWith('ledgers', {
      page: 0,
      size: 10,
    });
  });
});
