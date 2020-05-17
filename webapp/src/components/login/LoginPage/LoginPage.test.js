import { fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import render from '../../../tests/renderWithRouter';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('should prevent submission when no password entered', async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(screen.getByText(/required/i)).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled();
  });

  it('should display error message when authentication error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/authenticate').reply(401);

    const { history } = render(<LoginPage />, {
      route: '/login',
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'loginpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled());
    await waitFor(() => expect(screen.getByText('Login failed')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: /log in/i })).toBeEnabled());

    expect(history.location.pathname).toBe('/login');
  });

  it('should submit token with user agent', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'user-agent-value',
      writable: true,
    });

    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/authenticate').reply(201, {
      token: 'generated-auth-token',
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'loginpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(mockAxios.history.post.length).toBe(1));
    expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
      password: 'loginpassword',
      source: 'user-agent-value',
    });
  });

  it('should save token in localstorage when authentication successful', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/authenticate').reply(201, {
      token: 'generated-auth-token',
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'loginpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled());
    await waitFor(() => expect(screen.getByRole('button', { name: /log in/i })).toBeEnabled());
    expect(screen.queryByText('Login failed')).not.toBeInTheDocument();

    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      'underbudget.api.token',
      'generated-auth-token',
    );
  });

  it('should redirect to root when authentication successful', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/authenticate').reply(201, {
      token: 'generated-auth-token',
    });

    const { history } = render(<LoginPage />, {
      route: '/login',
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'loginpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled());
    await waitFor(() => expect(screen.getByRole('button', { name: /log in/i })).toBeEnabled());
    expect(screen.queryByText('Login failed')).not.toBeInTheDocument();

    expect(history.location.pathname).toBe('/');
  });

  it('should redirect to from location when authentication successful', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/authenticate').reply(201, {
      token: 'generated-auth-token',
    });

    const { history } = render(<LoginPage />, {
      route: {
        pathname: '/login',
        state: { from: '/last-page' },
      },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'loginpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled());
    await waitFor(() => expect(screen.getByRole('button', { name: /log in/i })).toBeEnabled());
    expect(screen.queryByText('Login failed')).not.toBeInTheDocument();

    expect(history.location.pathname).toBe('/last-page');
  });
});
