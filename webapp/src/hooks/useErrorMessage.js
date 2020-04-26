import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const authErrors = [401, 403];

const noByStatus = {};

// eslint-disable-next-line react/prop-types
const defaultAuthMessage = (error, location) => (
  <span>
    {'You are no longer logged in, please '}
    <Link to='/login' state={{ from: location }}>
      log in
    </Link>
    {' again'}
  </span>
);

const getMessage = (error, location, message) => {
  if (typeof message === 'function') {
    return message(error, location);
  }
  return message;
};

export default function useErrorMessage({
  auth = defaultAuthMessage,
  byStatus = noByStatus,
  request = 'Unable to perform requested operation',
  server = 'An error occurred on the server, please try again',
}) {
  const location = useLocation();
  return React.useCallback(
    (error) => {
      if (!error) return null;
      if (typeof error === 'object' && error.response) {
        if (byStatus[error.response.status]) {
          return getMessage(error, location, byStatus[error.response.status]);
        }
        if (error.response.status >= 500) {
          return getMessage(error, location, server);
        }
        if (authErrors.includes(error.response.status)) {
          return getMessage(error, location, auth);
        }
      }
      return getMessage(error, location, request);
    },
    [auth, byStatus, request, server, location],
  );
}
