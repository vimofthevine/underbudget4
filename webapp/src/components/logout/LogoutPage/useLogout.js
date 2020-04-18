import decode from 'jwt-decode';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import deleteToken from '../../../api/tokens/deleteToken';
import { getApiToken, removeApiToken, routes } from '../../../utils';

// eslint-disable-next-line import/prefer-default-export
export function useLogout() {
  const navigate = useNavigate();
  const handleLogin = useCallback(() => navigate(routes.LOGIN), [navigate]);

  useEffect(() => {
    const token = getApiToken();
    if (token) {
      const decoded = decode(getApiToken());
      deleteToken(decoded.jti)
        .then(() => removeApiToken())
        .catch(() => removeApiToken());
    }
  }, []);

  return {
    handleLogin,
  };
}
