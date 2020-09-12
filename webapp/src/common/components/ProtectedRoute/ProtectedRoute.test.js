import React from 'react';
import { Routes } from 'react-router-dom';

import render from '../../../tests/renderWithRouter';
import ProtectedRoute from './ProtectedRoute';

const ProtectedPage = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  it('should redirect unauthenticated users to login page', () => {
    localStorage.clear();
    const { history } = render(
      <Routes>
        <ProtectedRoute path='/page' element={<ProtectedPage />} />
      </Routes>,
      {
        route: '/page',
      },
    );
    expect(history.location.pathname).toBe('/login');
  });

  it('should allow authenticated users to render content', () => {
    localStorage.setItem('underbudget.api.token', 'generated-auth-token');
    const { history, queryByText } = render(
      <Routes>
        <ProtectedRoute path='/page' element={<ProtectedPage />} />
      </Routes>,
      {
        route: '/page',
      },
    );
    expect(history.location.pathname).toBe('/page');
    expect(queryByText('Protected Content')).toBeInTheDocument();
  });
});
