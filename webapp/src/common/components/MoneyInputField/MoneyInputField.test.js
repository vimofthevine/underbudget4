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

// test('can replace value with backspace', async () => {
//   const { textbox } = render({ initialValue: 8675309 });
//   await waitFor(() => expect(textbox).toHaveValue('$86,753.09'));
//   await userEvent.type(textbox, '{backspace}7', { delay: 10 });
//   await waitFor(() => expect(textbox).toHaveValue('$86,753.07'));
//   await userEvent.type(textbox, '{backspace}{backspace}42', { delay: 10 });
//   await waitFor(() => expect(textbox).toHaveValue('$86,753.42'));
// });

test('can replace entire value', async () => {
  const { textbox } = render({ initialValue: 8675309 });
  await waitFor(() => expect(textbox).toHaveValue('$86,753.09'));
  textbox.setSelectionRange(0, 10);
  userEvent.type(textbox, '{backspace}2,468');
  await waitFor(() => expect(textbox).toHaveValue('$2,468.00'));
  await userEvent.type(textbox, '{selectall}12', { delay: 500 });
  await waitFor(() => expect(textbox).toHaveValue('$12.00'));
  await userEvent.type(textbox, '{selectall}1357', { delay: 500 });
  await userEvent.type(textbox, '2468', { delay: 100 });
  await waitFor(() => expect(textbox).toHaveValue('$1,234.00'));
}, 30000);
