import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';

import createMediaQuery from '../../../tests/createMediaQuery';
import renderWithRouter from '../../../tests/renderWithRouter';
import EnvelopesListPage from './EnvelopesListPage';

const render = ({ route = '/envelopes', width = '800px' } = {}) => {
  window.matchMedia = createMediaQuery(width);
  configure({ defaultHidden: true });

  localStorage.setItem('underbudget.selected.ledger', '2');

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(200, { categories: [] });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retryDelay: 200,
      },
    },
  });

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/envelopes/*' element={<EnvelopesListPage />} />
        </Routes>
      </QueryClientProvider>,
      { route },
    ),
    mockAxios,
    queryClient,
  };
};

test('should display create-envelope dialog if initial route matches', async () => {
  const { history } = render({ route: '/envelopes/create' });
  expect(screen.getByRole('heading', { name: /create envelope/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/envelopes/'));
  expect(screen.queryByRole('heading', { name: /create envelope/i })).not.toBeInTheDocument();
});

test('should display create-category dialog if initial route matches', async () => {
  const { history } = render({ route: '/envelopes/create-category' });
  expect(screen.getByRole('heading', { name: /create category/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/envelopes/'));
  expect(screen.queryByRole('heading', { name: /create category/i })).not.toBeInTheDocument();
});

test('should display modify-envelope dialog if initial route matches', async () => {
  const { history } = render({ route: '/envelopes/modify/1' });
  expect(screen.getByRole('heading', { name: /modify envelope/i })).toBeInTheDocument();

  await waitFor(() => expect(history.location.pathname).toBe('/envelopes/'));
  expect(screen.queryByRole('heading', { name: /modify envelope/i })).not.toBeInTheDocument();
});

test('should display modify-category dialog if initial route matches', async () => {
  const { history } = render({ route: '/envelopes/modify-category/1' });
  expect(screen.getByRole('heading', { name: /modify category/i })).toBeInTheDocument();

  await waitFor(() => expect(history.location.pathname).toBe('/envelopes/'));
  expect(screen.queryByRole('heading', { name: /modify category/i })).not.toBeInTheDocument();
});

test('should open create dialogs when using nav bar actions', async () => {
  const { history } = render();

  // Make sure no dialogs open initially
  expect(screen.queryAllByRole('heading')).toHaveLength(1);
  expect(screen.getByRole('heading', { name: /envelopes/i })).toBeInTheDocument();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /create envelope$/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /create envelope/i })).toBeInTheDocument()
  );
  expect(history.location.pathname).toBe('/envelopes/create');

  userEvent.click(screen.getByRole('button', { name: /create envelope category/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /create category/i })).toBeInTheDocument()
  );
  expect(history.location.pathname).toBe('/envelopes/create-category');
});
