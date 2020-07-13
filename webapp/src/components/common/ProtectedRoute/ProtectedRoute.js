import React, { useEffect } from 'react';
import { Route, useLocation, useNavigate } from 'react-router-dom';

import getApiToken from '../../../common/utils/getApiToken';
import * as routes from '../../../common/utils/routes';

const ProtectedRoute = ({ element, path }) => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!getApiToken()) {
      navigate(routes.LOGIN, { state: { from: location } });
    }
  }, [location, navigate]);

  return <Route element={element} path={path} />;
};

ProtectedRoute.propTypes = Route.propTypes;

export default ProtectedRoute;
