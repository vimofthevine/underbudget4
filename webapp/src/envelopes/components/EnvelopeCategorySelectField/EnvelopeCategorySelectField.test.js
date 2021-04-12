import { render as baseRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import EnvelopeCategorySelectField from './EnvelopeCategorySelectField';

const URL = '/api/ledgers/2/envelope-categories';

const defaultConfigureMock = (mock) => {
  mock.onGet(URL).reply(200, {
    categories: [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ],
  });
};

const render = (
  ui,
  {
    configureMock = defaultConfigureMock,
    initialValues = {},
    selectedLedger = '2',
    validate = () => ({}),
  },
) => {
  localStorage.setItem('underbudget.selected.ledger', selectedLedger);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  const mock = new MockAdapter(axios);
  configureMock(mock);

  const handleSubmit = jest.fn();

  // eslint-disable-next-line react/prop-types
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={validate}>
          <Form>
            {children}
            <button type='submit'>Submit</button>
          </Form>
        </Formik>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return {
    ...baseRender(ui, { wrapper: Wrapper }),
    handleSubmit,
    mock,
  };
};

describe('EnvelopeCategorySelectField', () => {
  it('should display current category name', async () => {
    render(<Field name='catField' component={EnvelopeCategorySelectField} />, {
      initialValues: { catField: 2 },
    });
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('Category 2'));
  });

  it('should display nothing when field is empty', async () => {
    const { mock } = render(<Field name='catField' component={EnvelopeCategorySelectField} />, {
      initialValues: { catField: '' },
    });
    await waitFor(() => expect(mock.history.get.length).toBe(1));
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('should display nothing when unable to fetch categories', async () => {
    const { mock } = render(<Field name='catField' component={EnvelopeCategorySelectField} />, {
      configureMock: () => 0,
      initialValues: { catField: 2 },
    });
    await waitFor(() => expect(mock.history.get.length).toBe(1));
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('should display nothing when category does not exist', async () => {
    const { mock } = render(<Field name='catField' component={EnvelopeCategorySelectField} />, {
      initialValues: { catField: 3 },
    });
    await waitFor(() => expect(mock.history.get.length).toBe(1));
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('should set field value to selected category ID', async () => {
    const { handleSubmit } = render(
      <Field name='catField' component={EnvelopeCategorySelectField} />,
      {
        initialValues: { catField: 1 },
      },
    );
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('Category 1'));

    userEvent.click(screen.getByRole('button', { name: /open/i }));
    userEvent.click(screen.getByRole('option', { name: 'Category 2' }));
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('Category 2'));

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
    expect(handleSubmit.mock.calls[0][0]).toEqual({ catField: 2 });
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should set field value to directly entered category ID', async () => {
    const { handleSubmit } = render(
      <Field name='catField' component={EnvelopeCategorySelectField} />,
      {
        initialValues: { catField: 1 },
      },
    );
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('Category 1'));

    userEvent.clear(screen.getByRole('textbox'));
    await userEvent.type(screen.getByRole('textbox'), 'Category 2');

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
    expect(handleSubmit.mock.calls[0][0]).toEqual({ catField: 2 });
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should not set field value when invalid category is entered', async () => {
    const { handleSubmit } = render(
      <Field name='catField' component={EnvelopeCategorySelectField} />,
      {
        initialValues: { catField: 1 },
      },
    );
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('Category 1'));

    userEvent.clear(screen.getByRole('textbox'));
    await userEvent.type(screen.getByRole('textbox'), 'Category 5');
    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
    expect(handleSubmit.mock.calls[0][0]).toEqual({ catField: 1 });

    expect(screen.getByRole('textbox')).toHaveValue('Category 1');
  });

  it('should show validation error text when invalid', async () => {
    render(<Field name='catField' component={EnvelopeCategorySelectField} />, {
      initialValues: { catField: 1 },
      validate: () => ({ catField: 'Category is bad' }),
    });
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('Category 1'));
    expect(screen.queryByText(/category is bad/i)).not.toBeInTheDocument();

    userEvent.clear(screen.getByRole('textbox'));
    await userEvent.type(screen.getByRole('textbox'), 'Category 2');
    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(screen.getByText(/category is bad/i)).toBeInTheDocument());
  });
});
