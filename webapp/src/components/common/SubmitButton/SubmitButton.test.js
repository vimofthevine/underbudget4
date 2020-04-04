import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import SubmitButton from './SubmitButton';

describe('SubmitButton', () => {
  it('should submit enclosed form when clicked', async () => {
    const submit = jest.fn((e) => e.preventDefault());
    render(
      <form onSubmit={submit}>
        <SubmitButton text='Click Me' />
      </form>,
    );

    fireEvent.click(screen.getByText('Click Me'));
    await waitFor(() => expect(submit).toHaveBeenCalled());
  });

  it('should not submit enclosed form when disabled', async () => {
    const submit = jest.fn((e) => e.preventDefault());
    render(
      <form onSubmit={submit}>
        <SubmitButton text='Click Me' disabled />
      </form>,
    );

    expect(screen.getByText('Click Me').closest('button')).toBeDisabled();
    fireEvent.click(screen.getByText('Click Me'));
    await waitFor(() => expect(submit).not.toHaveBeenCalled());
  });
});
