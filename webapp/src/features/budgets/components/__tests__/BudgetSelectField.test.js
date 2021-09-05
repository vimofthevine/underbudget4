import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import setSelectedLedger from 'common/utils/setSelectedLedger';
import renderWithRouter from 'tests/renderWithRouter';
import setupMockApi from 'tests/setupMockApi';
import BudgetSelectField from '../BudgetSelectField';

const render = ({ initialValues = {}, ...formikProps } = {}) => {
  setSelectedLedger('2');

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity } },
  });

  const mockApi = setupMockApi({ delayResponse: 0 });
  mockApi.onGet('/api/ledgers/2/budgets').reply(200, {
    budgets: [
      { id: 2, name: 'Budget 2', periods: 2 },
      { id: 1, name: 'Budget 1', periods: 1 },
      { id: 3, name: 'Budget 3', periods: 3 },
    ],
  });

  const handleSubmit = jest.fn();

  return {
    ...renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} {...formikProps}>
          <Form>
            <Field name='budget' component={BudgetSelectField} />
            <button type='submit'>Submit</button>
          </Form>
        </Formik>
      </QueryClientProvider>,
    ),
    handleSubmit,
    mockApi,
  };
};

test('should allow budgets as selectable options', async () => {
  const { handleSubmit } = render({ initialValues: { budget: 2 } });

  const textbox = screen.getByRole('textbox');
  await waitFor(() => expect(textbox).toHaveValue('Budget 2'));

  userEvent.click(screen.getByRole('button', { name: /open/i }));

  const options = screen.getAllByRole('option');
  expect(options).toHaveLength(3);
  expect(options[0]).toHaveTextContent('Budget 1');
  expect(options[1]).toHaveTextContent('Budget 2');
  expect(options[2]).toHaveTextContent('Budget 3');

  userEvent.click(options[2]);
  await waitFor(() => expect(textbox).toHaveValue('Budget 3'));

  userEvent.click(screen.getByRole('button', { name: /submit/i }));
  await waitFor(() => expect(handleSubmit).toHaveBeenCalled());

  expect(handleSubmit.mock.calls[0][0]).toEqual({ budget: 3 });
});
