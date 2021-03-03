import PropTypes from 'prop-types';
import React from 'react';

import { useLedgersReducer } from './useLedgersReducer';

const DispatchContext = React.createContext();
const StateContext = React.createContext();

const LedgersContextProvider = ({ children, initialState }) => {
  const [state, dispatch] = useLedgersReducer(initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};

LedgersContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  initialState: PropTypes.shape({}),
};

LedgersContextProvider.defaultProps = {
  initialState: null,
};

const useLedgersState = () => {
  const context = React.useContext(StateContext);
  if (context === undefined) {
    throw new Error('useLedgersState must be used within a LedgersContextProvider');
  }
  return context;
};

const useLedgersDispatch = () => {
  const context = React.useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useLedgersDispatch must be used within a LedgersContextProvider');
  }
  return context;
};

export { LedgersContextProvider, useLedgersDispatch, useLedgersState };
