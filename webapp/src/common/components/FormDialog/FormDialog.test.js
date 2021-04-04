import { render as baseRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mediaQuery from 'css-mediaquery';
import { Field } from 'formik';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import * as yup from 'yup';

import createMediaQuery from '../../../tests/createMediaQuery';
import { ConfirmationContextProvider } from '../../contexts/confirmation';
import FormDialog from './FormDialog';

const Form = () => <Field name='fieldName' />;

const render = (ui, { route = '/', width = '800px' } = {}) => {
  const history = createMemoryHistory({ initialEntries: [route] });
  const Wrapper = ({ children }) => (
    <Router action={history.action} location={history.location} navigator={history}>
      <ConfirmationContextProvider>{children}</ConfirmationContextProvider>
    </Router>
  );

  window.matchMedia = createMediaQuery(width);

  return {
    ...baseRender(ui, { wrapper: Wrapper }),
    history,
  };
};

test('FormDialog should navigate to route when closed on mobile', async () => {
  const { history } = render(
    <FormDialog
      actionText='Apply'
      FormComponent={Form}
      onExitNavigateTo='/resources'
      onSubmit={() => 0}
      title='Dialog Title'
    />,
    { route: '/resources/create', width: '400px' },
  );
  expect(screen.getByRole('heading', { name: 'Dialog Title' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /close/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/resources'));
  expect(screen.queryByRole('heading', { name: 'Dialog Title' })).not.toBeInTheDocument();
});

test('FormDialog should prompt to close when dirty and mobile', async () => {
  const { history } = render(
    <FormDialog
      actionText='Apply'
      cancelConfirmText=''
      FormComponent={Form}
      initialValues={{ fieldName: '' }}
      onExitNavigateTo='/resources'
      onSubmit={() => 0}
      title='Dialog Title'
    />,
    { route: '/resources/create', width: '400px' },
  );

  expect(screen.getByRole('heading', { name: 'Dialog Title' })).toBeInTheDocument();
  userEvent.type(screen.getByRole('textbox'), 'entered value');
  userEvent.click(screen.getByRole('button', { name: /close/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /cancel?/i })).toBeInTheDocument(),
  );

  userEvent.click(screen.getByRole('button', { name: /no/i }));
  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: /cancel?/i })).not.toBeInTheDocument(),
  );
  expect(screen.getByRole('heading', { name: 'Dialog Title' })).toBeInTheDocument();
  expect(history.location.pathname).toBe('/resources/create');

  userEvent.click(screen.getByRole('button', { name: /close/i }));
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /cancel?/i })).toBeInTheDocument(),
  );

  userEvent.click(screen.getByRole('button', { name: /yes/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/resources'));
  expect(screen.queryByRole('heading', { name: /cancel?/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Dialog Title' })).not.toBeInTheDocument();
});

test('FormDialog should navigate to route when cancelled on desktop', async () => {
  const { history } = render(
    <FormDialog
      actionText='Apply'
      FormComponent={Form}
      onExitNavigateTo='/resources'
      onSubmit={() => 0}
      title='Dialog Title'
    />,
    { route: '/resources/create', width: '800px' },
  );
  expect(screen.getByRole('heading', { name: 'Dialog Title' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/resources'));
  expect(screen.queryByRole('heading', { name: 'Dialog Title' })).not.toBeInTheDocument();
});

test('FormDialog should prompt to close when dirty and desktop', async () => {
  window.confirm = jest.fn();
  window.confirm.mockReturnValueOnce(false).mockReturnValueOnce(true);

  const { history } = render(
    <FormDialog
      actionText='Apply'
      cancelConfirmText=''
      FormComponent={Form}
      initialValues={{ fieldName: '' }}
      onExitNavigateTo='/resources'
      onSubmit={() => 0}
      title='Dialog Title'
    />,
    { route: '/resources/create', width: '800px' },
  );

  expect(screen.getByRole('heading', { name: 'Dialog Title' })).toBeInTheDocument();
  userEvent.type(screen.getByRole('textbox'), 'entered value');

  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  expect(screen.getByRole('heading', { name: 'Dialog Title' })).toBeInTheDocument();
  expect(history.location.pathname).toBe('/resources/create');

  userEvent.click(screen.getByRole('button', { name: /cancel/i }));
  await waitFor(() => expect(history.location.pathname).toBe('/resources'));
  expect(screen.queryByRole('heading', { name: 'Dialog Title' })).not.toBeInTheDocument();
});

test('FormDialog should submit form contents and remain on screen when an error occurs and mobile', async () => {
  const handleSubmit = jest.fn(
    (_, { onSettled }) =>
      new Promise((resolve) =>
        setTimeout(() => {
          onSettled();
          resolve();
        }, 50),
      ),
  );

  render(
    <FormDialog
      actionText='Try Anyway'
      FormComponent={Form}
      initialValues={{ fieldName: '' }}
      onSubmit={handleSubmit}
      title='Should Fail'
      validationSchema={yup.object().shape({ fieldName: yup.string().required() })}
    />,
    { width: '400px' },
  );

  expect(screen.getByRole('heading', { name: 'Should Fail' })).toBeInTheDocument();
  const submitButton = screen.getByRole('button', { name: 'Try Anyway' });

  userEvent.click(submitButton);
  await waitFor(() => expect(submitButton).toBeDisabled());

  userEvent.type(screen.getByRole('textbox'), 'entered value');
  await waitFor(() => expect(submitButton).toBeEnabled());

  userEvent.click(submitButton);
  await waitFor(() => expect(submitButton).toBeDisabled());
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

  await waitFor(() => expect(submitButton).toBeEnabled());
  expect(screen.getByRole('textbox')).toHaveDisplayValue('entered value');
});

test('FormDialog should submit form contents and remain on screen when an error occurs and desktop', async () => {
  const handleSubmit = jest.fn(
    (_, { onSettled }) =>
      new Promise((resolve) =>
        setTimeout(() => {
          onSettled();
          resolve();
        }, 50),
      ),
  );

  render(
    <FormDialog
      actionText='Try Anyway'
      FormComponent={Form}
      initialValues={{ fieldName: '' }}
      onSubmit={handleSubmit}
      title='Should Fail'
      validationSchema={yup.object().shape({ fieldName: yup.string().required() })}
    />,
    { width: '800px' },
  );

  expect(screen.getByRole('heading', { name: 'Should Fail' })).toBeInTheDocument();
  const submitButton = screen.getByRole('button', { name: 'Try Anyway' });

  userEvent.click(submitButton);
  await waitFor(() => expect(submitButton).toBeDisabled());

  userEvent.type(screen.getByRole('textbox'), 'entered value');
  await waitFor(() => expect(submitButton).toBeEnabled());

  userEvent.click(submitButton);
  await waitFor(() => expect(submitButton).toBeDisabled());
  expect(screen.queryByRole('progressbar')).toBeInTheDocument();

  await waitFor(() => expect(submitButton).toBeEnabled());
  expect(screen.getByRole('textbox')).toHaveDisplayValue('entered value');
});

test('FormDialog should submit form contents and navigate to route when successful and mobile', async () => {
  const handleSubmit = jest.fn(
    (_, { onSettled, onSuccess }) =>
      new Promise((resolve) =>
        setTimeout(() => {
          onSuccess();
          onSettled();
          resolve();
        }, 50),
      ),
  );

  const { history } = render(
    <FormDialog
      actionText='Go'
      FormComponent={Form}
      initialValues={{ fieldName: '' }}
      onExitNavigateTo='/success'
      onSubmit={handleSubmit}
      title='Should Succeed'
    />,
    { width: '400px' },
  );

  expect(screen.getByRole('heading', { name: 'Should Succeed' })).toBeInTheDocument();
  const submitButton = screen.getByRole('button', { name: 'Go' });

  userEvent.type(screen.getByRole('textbox'), 'entered value');
  await waitFor(() => expect(submitButton).toBeEnabled());

  userEvent.click(submitButton);
  await waitFor(() => expect(submitButton).toBeDisabled());
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

  await waitFor(() => expect(history.location.pathname).toBe('/success'));
  expect(screen.queryByRole('heading', { name: 'Should Succeed' })).not.toBeInTheDocument();
});

test('FormDialog should submit form contents and navigate to route when successful and desktop', async () => {
  const handleSubmit = jest.fn(
    (_, { onSettled, onSuccess }) =>
      new Promise((resolve) =>
        setTimeout(() => {
          onSuccess();
          onSettled();
          resolve();
        }, 50),
      ),
  );

  const { history } = render(
    <FormDialog
      actionText='Go'
      FormComponent={Form}
      initialValues={{ fieldName: '' }}
      onExitNavigateTo='/success'
      onSubmit={handleSubmit}
      title='Should Succeed'
    />,
    { width: '800px' },
  );

  expect(screen.getByRole('heading', { name: 'Should Succeed' })).toBeInTheDocument();
  const submitButton = screen.getByRole('button', { name: 'Go' });

  userEvent.type(screen.getByRole('textbox'), 'entered value');
  await waitFor(() => expect(submitButton).toBeEnabled());

  userEvent.click(submitButton);
  await waitFor(() => expect(submitButton).toBeDisabled());
  expect(screen.queryByRole('progressbar')).toBeInTheDocument();

  await waitFor(() => expect(history.location.pathname).toBe('/success'));
  expect(screen.queryByRole('heading', { name: 'Should Succeed' })).not.toBeInTheDocument();
});
