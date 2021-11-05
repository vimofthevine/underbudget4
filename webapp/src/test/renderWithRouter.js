import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';

import AppProviders from '../common/components/AppProviders';
import MemoryRouter from '../common/components/MemoryRouter';

export default (
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) => {
  // eslint-disable-next-line react/prop-types
  const Wrapper = ({ children }) => (
    <MemoryRouter history={history}>
      <AppProviders>{children}</AppProviders>
    </MemoryRouter>
  );

  return {
    ...render(ui, { wrapper: Wrapper }),
    history,
  };
};
