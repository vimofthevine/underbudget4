import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default () => {
  const { search, state } = useLocation();
  const navigate = useNavigate();
  return React.useCallback(
    (to, opts) =>
      navigate(typeof to === 'string' ? { pathname: to, search } : { search, ...to }, {
        state,
        ...opts,
      }),
    [navigate, search],
  );
};
