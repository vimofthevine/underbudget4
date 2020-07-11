import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import mediaQuery from 'css-mediaquery';
import { Field } from 'formik';
import React from 'react';

import ResponsiveDialogForm from './ResponsiveDialogForm';

const Form = () => <Field name='fieldName' />;

const createMediaQuery = (width) => (query) => ({
  matches: mediaQuery.match(query, { width }),
  addListener: () => 0,
  removeListener: () => 0,
});

describe('ResponsiveDialogForm', () => {
  it('should display title when mobile', async () => {
    window.matchMedia = createMediaQuery('400px');
    render(
      <ResponsiveDialogForm
        actionText='Apply'
        FormComponent={Form}
        onClose={() => 0}
        open
        title='Dialog Title'
      />,
    );
    expect(screen.getByRole('heading', { name: 'Dialog Title' })).toBeInTheDocument();
  });

  it('should display title when desktop', async () => {
    window.matchMedia = createMediaQuery('800px');
    render(
      <ResponsiveDialogForm
        actionText='Apply'
        FormComponent={Form}
        onClose={() => 0}
        open
        title='Dialog Title'
      />,
    );
    expect(screen.getByRole('heading', { name: 'Dialog Title' })).toBeInTheDocument();
  });

  it('should have close button when mobile', async () => {
    window.matchMedia = createMediaQuery('400px');
    const handleClose = jest.fn();
    render(
      <ResponsiveDialogForm
        actionText='Apply'
        FormComponent={Form}
        onClose={handleClose}
        open
        title='Dialog Title'
      />,
    );

    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('should have cancel button when desktop', async () => {
    window.matchMedia = createMediaQuery('800px');
    const handleClose = jest.fn();
    render(
      <ResponsiveDialogForm
        actionText='Apply'
        FormComponent={Form}
        onClose={handleClose}
        open
        title='Dialog Title'
      />,
    );

    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('should disable action button when validation error and mobile', async () => {
    window.matchMedia = createMediaQuery('400px');
    render(
      <ResponsiveDialogForm
        actionText='Apply'
        formikProps={{
          initialErrors: { fieldName: 'not valid' },
          initialValues: { fieldName: 'field value' },
          onSubmit: () => 0,
        }}
        FormComponent={Form}
        onClose={() => 0}
        open
        title='Dialog Title'
      />,
    );

    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  it('should disable action button when validation error and desktop', async () => {
    window.matchMedia = createMediaQuery('800px');
    render(
      <ResponsiveDialogForm
        actionText='Apply'
        formikProps={{
          initialErrors: { fieldName: 'not valid' },
          initialValues: { fieldName: 'field value' },
          onSubmit: () => 0,
        }}
        FormComponent={Form}
        onClose={() => 0}
        open
        title='Dialog Title'
      />,
    );

    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
  });

  it('should submit form when action button is clicked and mobile', async () => {
    window.matchMedia = createMediaQuery('400px');
    const handleSubmit = jest.fn(() => new Promise((res) => setTimeout(res, 50)));
    render(
      <ResponsiveDialogForm
        actionText='Apply'
        formikProps={{
          initialValues: { fieldName: 'field value' },
          onSubmit: handleSubmit,
        }}
        FormComponent={Form}
        onClose={() => 0}
        open
        title='Dialog Title'
      />,
    );

    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled());
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    await waitFor(() => expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled());
  });

  it('should submit form when action button is clicked and desktop', async () => {
    window.matchMedia = createMediaQuery('800px');
    const handleSubmit = jest.fn(() => new Promise((res) => setTimeout(res, 50)));
    render(
      <ResponsiveDialogForm
        actionText='Apply'
        formikProps={{
          initialValues: { fieldName: 'field value' },
          onSubmit: handleSubmit,
        }}
        FormComponent={Form}
        onClose={() => 0}
        open
        title='Dialog Title'
      />,
    );

    expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled());
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled());
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
