import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';
import createMediaQuery from '../../../tests/createMediaQuery';

import renderWithRouter from '../../../tests/renderWithRouter';
import EnvelopesList from './EnvelopesList';

const threeCategories = {
  categories: [
    {
      id: 1,
      name: 'Category 1',
      envelopes: [
        { id: 1, name: 'Envelope 1' },
        { id: 2, name: 'Envelope 2' },
      ],
    },
    {
      id: 2,
      name: 'Category 2',
      envelopes: [],
    },
    {
      id: 3,
      name: 'Category 3',
      envelopes: [
        { id: 3, name: 'Envelope 3' },
        { id: 4, name: 'Envelope 4' },
      ],
    },
  ],
};

const render = ({ route = '/envelopes', width = '800px' } = {}) => {
  window.matchMedia = createMediaQuery(width);
  configure({ defaultHidden: true });

  localStorage.setItem('underbudget.selected.ledger', '2');

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
          <Route path='/envelopes/*' element={<EnvelopesList />} />
        </Routes>
      </QueryClientProvider>,
      { route },
    ),
    queryClient,
  };
};

const getListItems = () => {
  const items = {};

  const buttons = screen.queryAllByRole('button');
  expect(buttons).toHaveLength(14);

  let index = 0;
  const verifyNextButtons = (id, text) => {
    expect(buttons[index]).toHaveTextContent(text);
    expect(buttons[index]).toBeVisible();
    items[id] = {
      button: buttons[index],
      overflow: buttons[index + 1],
    };
    index += 2;
  };

  verifyNextButtons('category1', 'Category 1');
  verifyNextButtons('envelope1', 'Envelope 1');
  verifyNextButtons('envelope2', 'Envelope 2');
  verifyNextButtons('category2', 'Category 2');
  verifyNextButtons('category3', 'Category 3');
  verifyNextButtons('envelope3', 'Envelope 3');
  verifyNextButtons('envelope4', 'Envelope 4');

  return items;
};

test('should show error message when not logged in', async () => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(401);

  render();

  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  expect(screen.getByText(/you are no longer logged in/i)).toBeInTheDocument();
});

test('should collapse category sections', async () => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(200, threeCategories);

  render();
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('Category 1')).toBeInTheDocument());
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

  const items = getListItems();

  userEvent.click(items.category3.button);
  await waitFor(() => expect(items.envelope3.button).not.toBeVisible());
  await waitFor(() => expect(items.envelope4.button).not.toBeVisible());

  userEvent.click(items.category3.button);
  await waitFor(() => expect(items.envelope3.button).toBeVisible());
  await waitFor(() => expect(items.envelope4.button).toBeVisible());
});

test('should prompt to confirm deletion of category', async () => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(200, threeCategories);
  mockAxios.onDelete('/api/envelope-categories/2').reply(204);

  const { queryClient } = render();
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  await waitFor(() => expect(screen.getByText('Category 1')).toBeInTheDocument());

  const items = getListItems();

  // Can't delete categories with envelopes
  userEvent.click(items.category1.overflow);
  expect(screen.getByRole('menuitem', { name: /delete envelope category/i })).toHaveAttribute(
    'aria-disabled',
  );
  // Click on the menu backdrop
  userEvent.click(screen.getByRole('presentation').firstChild);
  await waitFor(() =>
    expect(
      screen.queryByRole('menuitem', { name: /delete envelope category/i }),
    ).not.toBeInTheDocument(),
  );

  // Reject cancellation
  userEvent.click(items.category2.overflow);
  userEvent.click(screen.getByRole('menuitem', { name: /delete envelope category/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /cancel/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  expect(mockAxios.history.delete).toHaveLength(0);

  // Confirm cancellation
  userEvent.click(items.category2.overflow);
  userEvent.click(screen.getByRole('menuitem', { name: /delete envelope category/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /ok/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(mockAxios.history.delete).toHaveLength(1));
  expect(mockAxios.history.delete[0].url).toBe('/api/envelope-categories/2');
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-categories', { ledger: '2' }]);
});

test('should prompt to confirm deletion of envelope', async () => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(200, threeCategories);
  mockAxios.onDelete('/api/envelopes/2').reply(204);

  const { queryClient } = render();
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');

  await waitFor(() => expect(screen.getByText('Category 1')).toBeInTheDocument());

  const items = getListItems();

  // TODO test that envelope with transactions cannot be deleted

  // Reject cancellation
  userEvent.click(items.envelope2.overflow);
  userEvent.click(screen.getByRole('menuitem', { name: /delete envelope/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /cancel/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  expect(mockAxios.history.delete).toHaveLength(0);

  // Confirm cancellation
  userEvent.click(items.envelope2.overflow);
  userEvent.click(screen.getByRole('menuitem', { name: /delete envelope/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /ok/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(mockAxios.history.delete).toHaveLength(1));
  expect(mockAxios.history.delete[0].url).toBe('/api/envelopes/2');
  expect(invalidateQueries).toHaveBeenCalledWith(['envelope-categories', { ledger: '2' }]);
});

test('should navigate to route to modify category', async () => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(200, threeCategories);

  const { history } = render({ route: '/envelopes?show-archived=true' });
  await waitFor(() => expect(screen.getByText('Category 1')).toBeInTheDocument());

  const items = getListItems();

  userEvent.click(items.category3.overflow);
  userEvent.click(screen.getByRole('menuitem', { name: /modify envelope category/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/envelopes/modify-category/3'));
  expect(history.location.search).toBe('?show-archived=true');
});

test('should navigate to route to modify envelope', async () => {
  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2/envelope-categories').reply(200, threeCategories);

  const { history } = render({ route: '/envelopes?show-archived=true' });
  await waitFor(() => expect(screen.getByText('Category 1')).toBeInTheDocument());

  const items = getListItems();

  userEvent.click(items.envelope4.overflow);
  userEvent.click(screen.getByRole('menuitem', { name: /modify envelope/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/envelopes/modify/4'));
  expect(history.location.search).toBe('?show-archived=true');
});
