import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';

import CurrencyInputField from './CurrencyInputField';

describe('CurrencyInputField', () => {
  it('should display current currency as ISO 4217 code', () => {
    render(
      <Formik initialValues={{ currField: 980 }}>
        <Field name='currField' component={CurrencyInputField} />
      </Formik>,
    );
    expect(screen.getByRole('textbox')).toHaveValue('UAH');
  });

  it('should display nothing when value is not a valid ISO 4217 number', () => {
    render(
      <Formik initialValues={{ currField: 9999 }}>
        <Field name='currField' component={CurrencyInputField} />
      </Formik>,
    );
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('should set field value to selected currency', async () => {
    const handleSubmit = jest.fn();
    render(
      <Formik initialValues={{ currField: 840 }} onSubmit={handleSubmit}>
        <Form>
          <Field name='currField' component={CurrencyInputField} />
          <button type='submit'>Submit</button>
        </Form>
      </Formik>,
    );

    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    fireEvent.click(screen.getByRole('option', { name: /RUB/i }));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
    expect(handleSubmit.mock.calls[0][0]).toEqual({ currField: 643 });
  });

  it('should set field value to directly entered currency', async () => {
    const handleSubmit = jest.fn();
    render(
      <Formik initialValues={{ currField: 840 }} onSubmit={handleSubmit}>
        <Form>
          <Field name='currField' component={CurrencyInputField} />
          <button type='submit'>Submit</button>
        </Form>
      </Formik>,
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'EUR' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
    expect(handleSubmit.mock.calls[0][0]).toEqual({ currField: 978 });
  });

  it('should not set field value when invalid currency is entered', async () => {
    const handleSubmit = jest.fn();
    render(
      <Formik initialValues={{ currField: 840 }} onSubmit={handleSubmit}>
        <Form>
          <Field name='currField' component={CurrencyInputField} />
          <button type='submit'>Submit</button>
        </Form>
      </Formik>,
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'WAMPUM' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
    expect(handleSubmit.mock.calls[0][0]).toEqual({ currField: 840 });

    expect(screen.getByRole('textbox')).toHaveValue('WAMPUM');
    fireEvent.blur(screen.getByRole('textbox'));
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('USD'));
  });

  it('should show validation error text when invalid', async () => {
    const handleSubmit = jest.fn();
    render(
      <Formik
        initialValues={{ currField: 840 }}
        onSubmit={handleSubmit}
        validate={() => ({ currField: 'Currency is bad' })}
      >
        <Form>
          <Field name='currField' component={CurrencyInputField} />
          <button type='submit'>Submit</button>
        </Form>
      </Formik>,
    );

    expect(screen.queryByText(/currency is bad/i)).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'EUR' } });
    fireEvent.blur(screen.getByRole('textbox'));
    await waitFor(() => expect(screen.getByText(/currency is bad/i)).toBeInTheDocument());
  });
});
