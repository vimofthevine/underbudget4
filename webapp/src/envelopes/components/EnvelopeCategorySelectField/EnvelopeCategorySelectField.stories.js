import { action } from '@storybook/addon-actions';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Field, Form, Formik } from 'formik';
import React from 'react';

import setSelectedLedger from '../../../ledgers/utils/setSelectedLedger';
import EnvelopeCategorySelectField from './EnvelopeCategorySelectField';

export default {
  title: 'envelopes/EnvelopeCategorySelectField',
  component: EnvelopeCategorySelectField,
  decorators: [
    (story) => story({ mock: new MockAdapter(axios, { delayResponse: 1000 }) }),
    (story) => {
      setSelectedLedger('ledger-id');
      return story();
    },
  ],
};

export const FetchError = (_, { mock }) => {
  mock.onGet('/api/ledgers/ledger-id/envelope-categories').reply(500);
  return (
    <Formik initialValues={{ category: '' }}>
      <Field component={EnvelopeCategorySelectField} label='Category' name='category' />
    </Formik>
  );
};

export const NoCategories = (_, { mock }) => {
  mock.onGet('/api/ledgers/ledger-id/envelope-categories').reply(200, {
    categories: [],
  });
  return (
    <Formik initialValues={{ category: '' }}>
      <Field
        component={EnvelopeCategorySelectField}
        label='Category'
        name='category'
        variant='outlined'
      />
    </Formik>
  );
};

export const InitiallyEmpty = (_, { mock }) => {
  mock.onGet('/api/ledgers/ledger-id/envelope-categories').reply(200, {
    categories: [
      { id: 'cat-id-1', name: 'Category 1' },
      { id: 'cat-id-2', name: 'Category 2' },
      { id: 'cat-id-3', name: 'Category 3' },
    ],
  });
  return (
    <Formik initialValues={{ category: '' }} onSubmit={action('submit')}>
      <Form>
        <Field component={EnvelopeCategorySelectField} label='Category' name='category' />
        <button type='submit'>submit</button>
      </Form>
    </Formik>
  );
};

export const InitiallyPopulated = (_, { mock }) => {
  mock.onGet('/api/ledgers/ledger-id/envelope-categories').reply(200, {
    categories: [
      { id: 'cat-id-1', name: 'Category 1' },
      { id: 'cat-id-2', name: 'Category 2' },
      { id: 'cat-id-3', name: 'Category 3' },
    ],
  });
  return (
    <Formik initialValues={{ category: 'cat-id-2' }} onSubmit={action('submit')}>
      <Form>
        <Field component={EnvelopeCategorySelectField} label='Category' name='category' />
        <button type='submit'>submit</button>
      </Form>
    </Formik>
  );
};
