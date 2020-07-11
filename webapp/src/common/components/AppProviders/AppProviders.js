import PropTypes from 'prop-types';
import React from 'react';

import { SelectionContextProvider } from '../../contexts/selection';

const AppProviders = ({ children }) => (
  <SelectionContextProvider>{children}</SelectionContextProvider>
);

AppProviders.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export default AppProviders;
