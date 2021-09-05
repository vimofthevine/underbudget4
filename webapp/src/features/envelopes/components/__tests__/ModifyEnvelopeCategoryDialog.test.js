import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import renderWithRouter from 'test/renderWithRouter';
import ModifyEnvelopeCategoryDialog from '../ModifyEnvelopeCategoryDialog';

const render = (category, code = 200) => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet(`/api/envelope-categories/${category.id}`).reply(code, category);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  localStorage.setItem('underbudget.selected.ledger', '2');

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/envelopes/modify-category/:id' element={<ModifyEnvelopeCategoryDialog />} />
        </Routes>
      </QueryClientProvider>,
      { route: `/envelopes/modify-category/${category.id}` },
    ),
    mockAxios,
    queryClient,
  };
};

test('should close dialog when unable to fetch category', async () => {
  const { history } = render({ id: 3 }, 404);
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /modify category/i })).toBeInTheDocument(),
  );
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify category/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(history.location.pathname).toBe('/envelopes'));
});

test('should prevent submission when required fields are missing', async () => {
  render({ id: 3, name: 'A category', lastUpdated: '' });

  await waitFor(() => expect(screen.getByLabelText(/name/i)).toHaveValue('A category'));

  userEvent.clear(screen.getByLabelText(/name/i));

  const saveButton = screen.getByRole('button', { name: /save/i });
  userEvent.click(saveButton);
  await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());
  expect(saveButton).toBeDisabled();
});

test('should show error message when request error', async () => {
  const { mockAxios } = render({ id: 3, name: 'A category', lastUpdated: '' });
  mockAxios.onPut('/api/envelope-categories/3').reply(400);

  await waitFor(() => expect(screen.getByLabelText(/name/i)).toHaveValue('A category'));

  userEvent.click(screen.getByRole('button', { name: /save/i }));
  await waitFor(() =>
    expect(screen.getByText(/unable to modify envelope category/i)).toBeInTheDocument(),
  );
});

test('should close and refresh query when successful modify', async () => {
  const { mockAxios, queryClient } = render({ id: 3, name: 'A category', lastUpdated: '' });
  mockAxios.onPut('/api/envelope-categories/3').reply(200);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  await waitFor(() => expect(screen.getByLabelText(/name/i)).toHaveValue('A category'));

  userEvent.type(screen.getByLabelText(/name/i), '{selectall}my category name');
  userEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /modify category/i })).not.toBeInTheDocument(),
  );
  expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
    name: 'my category name',
  });
  expect(invalidateQueries).toHaveBeenCalledWith([
    'envelope-categories',
    {
      ledger: '2',
    },
  ]);
});
