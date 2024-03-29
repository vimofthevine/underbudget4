import { configure, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';
import createMediaQuery from 'test/createMediaQuery';

import renderWithRouter from 'test/renderWithRouter';
import AccountsList from '../AccountsList';

const threeCategories = {
  categories: [
    {
      id: 1,
      name: 'Category 1',
      accounts: [
        { id: 1, name: 'Account 1' },
        { id: 2, name: 'Account 2' },
      ],
    },
    {
      id: 2,
      name: 'Category 2',
      accounts: [],
    },
    {
      id: 3,
      name: 'Category 3',
      accounts: [
        { id: 3, name: 'Account 3' },
        { id: 4, name: 'Account 4' },
      ],
    },
  ],
};

const render = (categories, code = 200, { route = '/accounts', width = '800px' } = {}) => {
  window.matchMedia = createMediaQuery(width);
  configure({ defaultHidden: true });

  localStorage.setItem('underbudget.selected.ledger', '2');

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2').reply(200, { currency: 840 });
  mockAxios.onGet('/api/ledgers/2/account-categories').reply(code, categories);
  mockAxios.onGet(/\/api\/accounts\/\d\/balance/).reply(200, { balance: 1234 });

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
          <Route path='/accounts/*' element={<AccountsList />} />
        </Routes>
      </QueryClientProvider>,
      { route },
    ),
    mockAxios,
    queryClient,
  };
};

const getListItems = () => {
  const items = {};

  const buttons = screen.queryAllByRole('button');
  expect(buttons).toHaveLength(10);

  let index = 0;
  const verifyNextButtons = (id, text, hasOverflow = false) => {
    expect(buttons[index]).toHaveTextContent(text);
    expect(buttons[index]).toBeVisible();
    items[id] = {
      button: buttons[index],
      overflow: hasOverflow ? buttons[index + 1] : null,
    };
    index += hasOverflow ? 2 : 1;
  };

  verifyNextButtons('category1', 'Category 1', true);
  verifyNextButtons('account1', 'Account 1');
  verifyNextButtons('account2', 'Account 2');
  verifyNextButtons('category2', 'Category 2', true);
  verifyNextButtons('category3', 'Category 3', true);
  verifyNextButtons('account3', 'Account 3');
  verifyNextButtons('account4', 'Account 4');

  return items;
};

test('should show error message when not logged in', async () => {
  render({}, 401);

  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  expect(screen.getByText(/you are no longer logged in/i)).toBeInTheDocument();
});

test('should collapse category sections', async () => {
  render(threeCategories);

  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('Category 1')).toBeInTheDocument());
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

  expect(screen.getAllByText('$12.34')).toHaveLength(4);

  const items = getListItems();

  userEvent.click(items.category3.button);
  await waitFor(() => expect(items.account3.button).not.toBeVisible());
  await waitFor(() => expect(items.account4.button).not.toBeVisible());

  userEvent.click(items.category3.button);
  await waitFor(() => expect(items.account3.button).toBeVisible());
  await waitFor(() => expect(items.account4.button).toBeVisible());
});

test('should prompt to confirm deletion of category', async () => {
  const { mockAxios, queryClient } = render(threeCategories);
  const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
  mockAxios.onDelete('/api/account-categories/2').reply(204);

  await waitFor(() => expect(screen.getByText('Category 1')).toBeInTheDocument());

  const items = getListItems();

  // Can't delete categories with accounts
  userEvent.click(items.category1.overflow);
  expect(screen.getByRole('menuitem', { name: /delete account category/i })).toHaveAttribute(
    'aria-disabled',
  );
  // Click on the menu backdrop
  userEvent.click(screen.getByRole('presentation').firstChild);
  await waitFor(() =>
    expect(
      screen.queryByRole('menuitem', { name: /delete account category/i }),
    ).not.toBeInTheDocument(),
  );

  // Reject cancellation
  userEvent.click(items.category2.overflow);
  userEvent.click(screen.getByRole('menuitem', { name: /delete account category/i }));
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
  userEvent.click(screen.getByRole('menuitem', { name: /delete account category/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /confirm/i })).toBeInTheDocument(),
  );
  userEvent.click(screen.getByRole('button', { name: /ok/i }));

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /confirm/i })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(mockAxios.history.delete).toHaveLength(1));
  expect(mockAxios.history.delete[0].url).toBe('/api/account-categories/2');
  expect(invalidateQueries).toHaveBeenCalledWith(['account-categories', { ledger: '2' }]);
});

test('should navigate to route to modify category', async () => {
  const { history } = render(threeCategories, 200, { route: '/accounts?show-archived=true' });
  await waitFor(() => expect(screen.getByText('Category 1')).toBeInTheDocument());

  const items = getListItems();

  userEvent.click(items.category3.overflow);
  userEvent.click(screen.getByRole('menuitem', { name: /modify account category/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/accounts/modify-category/3'));
  expect(history.location.search).toBe('?show-archived=true');
});
