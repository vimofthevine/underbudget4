import Snackbar from '@material-ui/core/Snackbar';
import PropTypes from 'prop-types';
import React from 'react';

const SnackbarContext = React.createContext();

const useSnackbar = () => {
  const context = React.useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarContextProvider');
  }
  return context;
};

const SnackbarContextProvider = ({ children }) => {
  const [message, setMessage] = React.useState(null);

  const showMessage = (msg) => setMessage(msg);
  const hideMessage = () => setMessage(null);

  return (
    <>
      <SnackbarContext.Provider value={showMessage}>{children}</SnackbarContext.Provider>

      <Snackbar
        autoHideDuration={3000}
        message={message}
        onClose={hideMessage}
        open={Boolean(message)}
      />
    </>
  );
};

SnackbarContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export { SnackbarContextProvider, useSnackbar };
