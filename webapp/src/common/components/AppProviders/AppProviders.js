import PropTypes from 'prop-types';
import React from 'react';

import { ConfirmationContextProvider } from '../../contexts/confirmation';
import { SelectionContextProvider } from '../../contexts/selection';
import { SnackbarContextProvider } from '../../contexts/snackbar';

const AppProviders = ({ children }) => (
  <ConfirmationContextProvider>
    <SnackbarContextProvider>
      <SelectionContextProvider>{children}</SelectionContextProvider>
    </SnackbarContextProvider>
  </ConfirmationContextProvider>
);

AppProviders.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export default AppProviders;
