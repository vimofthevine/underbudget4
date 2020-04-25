import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { ConfirmationServiceProvider } from '../components/common/ConfirmationService';
import { SnackbarServiceProvider } from '../components/common/SnackbarService';

export default (
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) => {
  // eslint-disable-next-line react/prop-types
  const Wrapper = ({ children }) => (
    <ConfirmationServiceProvider>
      <SnackbarServiceProvider>
        <Router history={history}>{children}</Router>
      </SnackbarServiceProvider>
    </ConfirmationServiceProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper }),
    history,
  };
};
