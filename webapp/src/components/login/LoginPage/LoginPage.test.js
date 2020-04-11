import { fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import render from '../../../tests/renderWithRouter';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('should prevent submission when no password entered', async () => {
    const { getByText } = render(<LoginPage />);

    fireEvent.click(getByText('Login'));

    await waitFor(() => getByText('Required'));
    expect(getByText('Login').closest('button')).toBeDisabled();
  });

  it('should display error message when authentication error', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/authenticate').reply(401);

    const { getByText, getByLabelText, history } = render(<LoginPage />, {
      route: '/login',
    });

    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'loginpassword' },
    });
    fireEvent.click(getByText('Login'));

    await waitFor(() => expect(getByText('Login')).toBeDisabled());
    await waitFor(() => expect(getByText('Login failed')).toBeInTheDocument());
    await waitFor(() => expect(getByText('Login')).toBeEnabled());

    expect(history.location.pathname).toBe('/login');
  });

  it('should save token in localstorage when authentication successful', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/authenticate').reply(201, {
      token: 'generated-auth-token',
    });

    const { getByText, getByLabelText, queryByText } = render(<LoginPage />);

    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'loginpassword' },
    });
    fireEvent.click(getByText('Login'));

    await waitFor(() => expect(getByText('Login')).toBeDisabled());
    await waitFor(() => expect(getByText('Login')).toBeEnabled());
    expect(queryByText('Login failed')).not.toBeInTheDocument();

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

    const { getByText, getByLabelText, history, queryByText } = render(<LoginPage />, {
      route: '/login',
    });

    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'loginpassword' },
    });
    fireEvent.click(getByText('Login'));

    await waitFor(() => expect(getByText('Login')).toBeDisabled());
    await waitFor(() => expect(getByText('Login')).toBeEnabled());
    expect(queryByText('Login failed')).not.toBeInTheDocument();

    expect(history.location.pathname).toBe('/');
  });

  it('should redirect to from location when authentication successful', async () => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onPost('/api/authenticate').reply(201, {
      token: 'generated-auth-token',
    });

    const { getByText, getByLabelText, history, queryByText } = render(<LoginPage />, {
      route: {
        pathname: '/login',
        state: { from: '/last-page' },
      },
    });

    fireEvent.change(getByLabelText('Password'), {
      target: { value: 'loginpassword' },
    });
    fireEvent.click(getByText('Login'));

    await waitFor(() => expect(getByText('Login')).toBeDisabled());
    await waitFor(() => expect(getByText('Login')).toBeEnabled());
    expect(queryByText('Login failed')).not.toBeInTheDocument();

    expect(history.location.pathname).toBe('/last-page');
  });
});
