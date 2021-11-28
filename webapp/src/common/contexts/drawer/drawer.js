import PropTypes from 'prop-types';
import React from 'react';

import useMobile from '../../hooks/useMobile';

const key = 'underbudget.drawer.open';
const setDrawerState = (open) => localStorage.setItem(key, String(open));
const getDrawerState = () => localStorage.getItem(key) === 'true';

const DrawerContext = React.createContext();

const useDrawerState = () => {
  const context = React.useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawerState must be used within a DrawerContextProvider');
  }
  return context;
};

const DrawerContextProvider = ({ children }) => {
  const mobile = useMobile();
  const [open, setOpen] = React.useState(mobile ? false : getDrawerState);
  const handleToggle = () => {
    if (!mobile) {
      setDrawerState(!open);
    }
    setOpen(!open);
  };

  return <DrawerContext.Provider value={[open, handleToggle]}>{children}</DrawerContext.Provider>;
};

DrawerContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export { DrawerContextProvider, useDrawerState };
