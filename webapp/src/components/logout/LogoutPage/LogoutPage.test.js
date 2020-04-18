import { act, fireEvent, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import render from '../../../tests/renderWithRouter';
import LogoutPage from './LogoutPage';

const TEST_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZXN0aXNzIiwiaWF0IjoxNTg3MjE0NzUzLCJleHAiOjE2MTg3NTA3NTMsImF1ZCI6InRlc3RhdWQiLCJzdWIiOiJ0ZXN0c3ViIiwianRpIjoidGVzdEp3dElkIn0.nEqpS32ni_t9c2aAcDPJuMHsOIr7YFPIfa8Hl6txbh8';

describe('LogoutPage', () => {
  it('should not send any requests when no API token exists', async () => {
    const mockAxios = new MockAdapter(axios);
    localStorage.clear();

    await act(async () => render(<LogoutPage />, { route: '/logout' }));
    expect(screen.queryByText(/you've been logged out!/i)).toBeInTheDocument();

    expect(mockAxios.history.delete.length).toBe(0);
    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });

  describe('should send delete request for API token', () => {
    test('with success', async () => {
      const mockAxios = new MockAdapter(axios);
      mockAxios.onDelete('/api/tokens/testJwtId').reply(200);

      localStorage.setItem('underbudget.api.token', TEST_TOKEN);

      await act(async () => render(<LogoutPage />, { route: '/logout' }));
      expect(screen.queryByText(/you've been logged out!/i)).toBeInTheDocument();

      expect(mockAxios.history.delete.length).toBe(1);
      expect(localStorage.removeItem).toHaveBeenLastCalledWith('underbudget.api.token');
    });

    test('with failure', async () => {
      const mockAxios = new MockAdapter(axios);
      mockAxios.onDelete('/api/tokens/testJwtId').reply(403);

      localStorage.setItem('underbudget.api.token', TEST_TOKEN);

      await act(async () => render(<LogoutPage />, { route: '/logout' }));
      expect(screen.queryByText(/you've been logged out!/i)).toBeInTheDocument();

      expect(mockAxios.history.delete.length).toBe(1);
      expect(localStorage.removeItem).toHaveBeenLastCalledWith('underbudget.api.token');
    });
  });

  it('should redirect to login page when login button is clicked', () => {
    const { getByText, history } = render(<LogoutPage />, { route: '/logout' });
    fireEvent.click(getByText(/log in again/i));
    expect(history.location.pathname).toBe('/login');
  });
});
