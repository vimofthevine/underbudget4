/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React, { useContext, useRef, useState } from 'react';

import ConfirmationDialog from '../ConfirmationDialog';

const ConfirmationContext = React.createContext();

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (context === undefined) {
    throw new Error('useConfirmation must be used within a ConfirmationServiceProvider');
  }
  return context;
};

export const ConfirmationServiceProvider = ({ children }) => {
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

ConfirmationServiceProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};
