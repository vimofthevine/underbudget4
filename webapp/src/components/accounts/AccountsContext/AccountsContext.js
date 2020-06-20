import PropTypes from 'prop-types';
import React from 'react';

import { useAccountsReducer } from './useAccountsReducer';

const DispatchContext = React.createContext();
const StateContext = React.createContext();

const AccountsContextProvider = ({ children }) => {
  const [state, dispatch] = useAccountsReducer();
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};

AccountsContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

const useAccountsState = () => {
  const context = React.useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAccountsState must be used within an AccountsContextProvider');
  }
  return context;
};

const useAccountsDispatch = () => {
  const context = React.useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useAccountsDispatch must be used within an AccountsContextProvider');
  }
  return context;
};

export { AccountsContextProvider, useAccountsDispatch, useAccountsState };
