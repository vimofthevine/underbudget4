import PropTypes from 'prop-types';
import React from 'react';

import useSelectionReducer from './useSelectionReducer';

const SelectionContext = React.createContext();

const SelectionContextProvider = ({ children }) => (
  <SelectionContext.Provider value={useSelectionReducer()}>{children}</SelectionContext.Provider>
);

SelectionContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

const useSelection = () => {
  const context = React.useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionContextProvider');
  }

  const [selected, dispatch] = context;

  const clear = () => dispatch({ type: 'clear' });

  const select = (payload) =>
    dispatch({
      type: 'select',
      payload,
    });

  const unselect = (payload) =>
    dispatch({
      type: 'unselect',
      payload,
    });

  return { selected, clear, select, unselect };
};

export { SelectionContextProvider, useSelection };
