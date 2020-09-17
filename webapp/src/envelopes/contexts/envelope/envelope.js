import PropTypes from 'prop-types';
import React from 'react';

import useEnvelopeReducer from './useEnvelopeReducer';

const DispatchContext = React.createContext();
const StateContext = React.createContext();

const EnvelopeContextProvider = ({ children }) => {
  const [state, dispatch] = useEnvelopeReducer();
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};

EnvelopeContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

const useEnvelopeState = () => {
  const context = React.useContext(StateContext);
  if (context === undefined) {
    throw new Error('useEnvelopeState must be used within an EnvelopeContextProvider');
  }
  return context;
};

const useEnvelopeDispatch = () => {
  const context = React.useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useEnvelopeDispatch must be used within an EnvelopeContextProvider');
  }
  return context;
};

export { EnvelopeContextProvider, useEnvelopeDispatch, useEnvelopeState };
