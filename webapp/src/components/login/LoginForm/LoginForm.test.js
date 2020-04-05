import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('should prevent submission when no password entered', async () => {
    const doLogin = jest.fn();
    render(<LoginForm onLogin={doLogin} />);

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => screen.getByText('Required'));
    expect(doLogin).not.toHaveBeenCalled();
    expect(screen.getByText('Login').closest('button')).toBeDisabled();
  });

  it('should allow submission when password is entered', async () => {
    const doLogin = jest.fn();
    render(<LoginForm onLogin={doLogin} />);

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'loginpassword' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => expect(doLogin).toHaveBeenCalled());
    expect(doLogin.mock.calls[0][0]).toEqual({ password: 'loginpassword' });
  });

  it('should prevent submission while submitting', async () => {
    const doLogin = jest.fn();
    render(<LoginForm onLogin={doLogin} />);

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'loginpassword' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => expect(doLogin).toHaveBeenCalled());
    expect(screen.getByText('Login').closest('button')).toBeDisabled();
  });
});
