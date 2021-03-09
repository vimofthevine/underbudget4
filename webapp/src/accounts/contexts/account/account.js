import PropTypes from 'prop-types';
import React from 'react';

import useAccountReducer from './useAccountReducer';

const DispatchContext = React.createContext();
const StateContext = React.createContext();

const AccountContextProvider = ({ children, initialState }) => {
  const [state, dispatch] = useAccountReducer(initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};

AccountContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  initialState: PropTypes.shape({}),
};

AccountContextProvider.defaultProps = {
  initialState: null,
};

const useAccountState = () => {
  const context = React.useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAccountsState must be used within an AccountContextProvider');
  }
  return context;
};

const useAccountDispatch = () => {
  const context = React.useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useAccountsDispatch must be used within an AccountContextProvider');
  }
  return context;
};

export { AccountContextProvider, useAccountDispatch, useAccountState };
