import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form, Formik } from 'formik';
import React from 'react';

import SubmitButton from './SubmitButton';

describe('SubmitButton', () => {
  it('should submit enclosed form when clicked', async () => {
    const submit = jest.fn();
    render(
      <Formik initialValues={{}} onSubmit={submit}>
        <Form>
          <SubmitButton text='Click Me' />
        </Form>
      </Formik>,
    );

    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    await waitFor(() => expect(submit).toHaveBeenCalled());
  });

  it('should be disabled when form validation error', () => {
    const submit = jest.fn();
    render(
      <Formik initialErrors={{ field: 'error message' }} initialValues={{}} onSubmit={submit}>
        <Form>
          <SubmitButton text='Click Me' />
        </Form>
      </Formik>,
    );

    expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled();
  });

  it('should be disabled when form is submitting', async () => {
    const submit = jest.fn(() => new Promise((res) => setTimeout(res, 50)));
    render(
      <Formik initialValues={{}} onSubmit={submit}>
        <Form>
          <SubmitButton text='Click Me' />
        </Form>
      </Formik>,
    );

    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    await waitFor(() => expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled());
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /click me/i })).not.toBeDisabled(),
    );
  });
});
