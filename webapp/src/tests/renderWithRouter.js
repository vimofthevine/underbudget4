import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import AppProviders from '../common/components/AppProviders';

export default (
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) => {
  // eslint-disable-next-line react/prop-types
  const Wrapper = ({ children }) => (
    <Router history={history}>
      <AppProviders>{children}</AppProviders>
    </Router>
  );

  return {
    ...render(ui, { wrapper: Wrapper }),
    history,
  };
};
