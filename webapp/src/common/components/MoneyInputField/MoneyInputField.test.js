import { render as baseRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import setSelectedLedger from '../../utils/setSelectedLedger';
import MoneyInputField from './MoneyInputField';

const render = ({ currency = 840, fieldArgs = {}, initialValue = 0 } = {}) => {
  setSelectedLedger(2);

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2').reply(200, { currency });

  const handleSubmit = jest.fn();

  const renderResults = baseRender(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Formik initialValues={{ field: initialValue }} onSubmit={handleSubmit}>
          <Form>
            <Field {...fieldArgs} component={MoneyInputField} name='field' />
            <button type='submit'>Submit</button>
          </Form>
        </Formik>
      </MemoryRouter>
    </QueryClientProvider>,
  );

  const textbox = screen.getByRole('textbox');

  return {
    ...renderResults,
    handleSubmit,
    mockAxios,
    textbox,
  };
};

test('should display initial value when zero', async () => {
  const { textbox } = render();
  expect(textbox).toHaveValue('0.00');
  await waitFor(() => expect(textbox).toHaveValue('$0.00'));
});

test('should display initial value when positive', async () => {
  const { textbox } = render({ initialValue: 12345678 });
  expect(textbox).toHaveValue('123,456.78');
  await waitFor(() => expect(textbox).toHaveValue('$123,456.78'));
});

test('should display initial value when negative', async () => {
  const { textbox } = render({ initialValue: -54321 });
  expect(textbox).toHaveValue('-543.21');
  await waitFor(() => expect(textbox).toHaveValue('-$543.21'));
});

test('should display initial value when euro currency', async () => {
  const { textbox } = render({ currency: 978, initialValue: 8675309 });
  expect(textbox).toHaveValue('86,753.09');
  await waitFor(() => expect(textbox).toHaveValue('€86,753.09'));
});

test('should display initial value when currency uses alternate number of digits', async () => {
  const { textbox } = render({ currency: '048', initialValue: 8675309 });
  expect(textbox).toHaveValue('86,753.09');
  await waitFor(() => expect(textbox).toHaveValue('.د.ب8,675.309'));
});

test('input value is properly scaled', async () => {
  const { handleSubmit, textbox } = render({ initialValue: 8675309 });
  await waitFor(() => expect(textbox).toHaveValue('$86,753.09'));
  userEvent.clear(textbox);
  await waitFor(() => expect(textbox).toHaveValue(''));
  userEvent.paste(textbox, '1234.56');
  await waitFor(() => expect(textbox).toHaveValue('$1,234.56'));
  userEvent.click(screen.getByRole('button'));
  await waitFor(() =>
    expect(handleSubmit).toHaveBeenCalledWith({ field: 123456 }, expect.any(Object)),
  );
});
