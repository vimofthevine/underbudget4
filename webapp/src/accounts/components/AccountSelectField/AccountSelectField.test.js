import { render as baseRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import setSelectedLedger from 'ledgers/utils/setSelectedLedger';
import AccountSelectField from './AccountSelectField';

const render = ({ initialValues = {}, ...formikProps } = {}) => {
  setSelectedLedger(2);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity } },
  });

  const mockAxios = new MockAdapter(axios);
  mockAxios.onGet('/api/ledgers/2/account-categories').reply(200, {
    categories: [
      {
        id: 1,
        name: 'Category 1',
        accounts: [
          { id: 1, name: 'Account 1' },
          { id: 2, name: 'Account 2' },
        ],
      },
      { id: 2, name: 'Category 2' },
      {
        id: 3,
        name: 'Category 3',
        accounts: [{ id: 3, name: 'Account 3' }],
      },
    ],
  });

  const handleSubmit = jest.fn();

  return {
    ...baseRender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Formik initialValues={initialValues} onSubmit={handleSubmit} {...formikProps}>
            <Form>
              <Field name='account' component={AccountSelectField} />
              <button type='submit'>Submit</button>
            </Form>
          </Formik>
        </MemoryRouter>
      </QueryClientProvider>,
    ),
    handleSubmit,
    mockAxios,
  };
};

test('should use flattened list of accounts as selectable options', async () => {
  const { handleSubmit } = render({ initialValues: { account: 2 } });

  const textbox = screen.getByRole('textbox');
  await waitFor(() => expect(textbox).toHaveValue('Category 1:Account 2'));

  userEvent.click(screen.getByRole('button', { name: /open/i }));

  const options = screen.getAllByRole('option');
  expect(options).toHaveLength(3);
  expect(options[0]).toHaveTextContent('Category 1:Account 1');
  expect(options[1]).toHaveTextContent('Category 1:Account 2');
  expect(options[2]).toHaveTextContent('Category 3:Account 3');

  userEvent.click(options[2]);
  await waitFor(() => expect(textbox).toHaveValue('Category 3:Account 3'));

  userEvent.click(screen.getByRole('button', { name: /submit/i }));
  await waitFor(() => expect(handleSubmit).toHaveBeenCalled());

  expect(handleSubmit.mock.calls[0][0]).toEqual({ account: 3 });
});
