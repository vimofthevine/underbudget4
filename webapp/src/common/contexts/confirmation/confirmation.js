import PropTypes from 'prop-types';
import React, { useContext, useRef, useState } from 'react';

import ConfirmationDialog from '../../components/ConfirmationDialog';

const ConfirmationContext = React.createContext();

const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (context === undefined) {
    throw new Error('useConfirmation must be used within a ConfirmationContextProvider');
  }
  return context;
};

const ConfirmationContextProvider = ({ children }) => {
  const promiseRef = useRef({
    reject: () => 0,
    resolve: () => 0,
  });

  const [confirmState, setConfirmState] = useState(null);

  const openConfirm = (options) => {
    setConfirmState(options);
    return new Promise((resolve, reject) => {
      promiseRef.current = { resolve, reject };
    });
  };

  const handleReject = () => {
    if (confirmState.catch && promiseRef.current) {
      promiseRef.current.reject();
    }
    setConfirmState({ ...confirmState, open: false });
  };

  const handleConfirm = () => {
    if (promiseRef.current) {
      promiseRef.current.resolve();
    }
    setConfirmState({ ...confirmState, open: false });
  };

  return (
    <>
      <ConfirmationContext.Provider value={openConfirm}>{children}</ConfirmationContext.Provider>

      <ConfirmationDialog
        onConfirm={handleConfirm}
        onReject={handleReject}
        open={Boolean(confirmState)}
        {...confirmState}
      />
    </>
  );
};

ConfirmationContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export { ConfirmationContextProvider, useConfirmation };
