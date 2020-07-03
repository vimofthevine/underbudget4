/* eslint-disable react/prop-types */
import { action } from '@storybook/addon-actions';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { MemoryRouter } from 'react-router';

import setSelectedLedger from '../../../utils/setSelectedLedger';
import AccountCategorySelectField from './AccountCategorySelectField';

export default {
  title: 'accounts/AccountCategorySelectField',
  component: AccountCategorySelectField,
  decorators: [
    (story) => story({ mock: new MockAdapter(axios, { delayResponse: 1000 }) }),
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
    (story) => {
      setSelectedLedger('ledger-id');
      return story();
    },
  ],
};

export const FetchError = ({ mock }) => {
  mock.onGet('/api/ledgers/ledger-id/accountCategories?projection=categoryWithAccounts').reply(500);
  return (
    <Formik initialValues={{ category: '' }}>
      <Field component={AccountCategorySelectField} label='Category' name='category' />
    </Formik>
  );
};

export const NoCategories = ({ mock }) => {
  mock
    .onGet('/api/ledgers/ledger-id/accountCategories?projection=categoryWithAccounts')
    .reply(200, {
      _embedded: { accountCategories: [] },
    });
  return (
    <Formik initialValues={{ category: '' }}>
      <Field
        component={AccountCategorySelectField}
        label='Category'
        name='category'
        variant='outlined'
      />
    </Formik>
  );
};

export const InitiallyEmpty = ({ mock }) => {
  mock
    .onGet('/api/ledgers/ledger-id/accountCategories?projection=categoryWithAccounts')
    .reply(200, {
      _embedded: {
        accountCategories: [
          { id: 'cat-id-1', name: 'Category 1' },
          { id: 'cat-id-2', name: 'Category 2' },
          { id: 'cat-id-3', name: 'Category 3' },
        ],
      },
    });
  return (
    <Formik initialValues={{ category: '' }} onSubmit={action('submit')}>
      <Form>
        <Field component={AccountCategorySelectField} label='Category' name='category' />
        <button type='submit'>submit</button>
      </Form>
    </Formik>
  );
};

export const InitiallyPopulated = ({ mock }) => {
  mock
    .onGet('/api/ledgers/ledger-id/accountCategories?projection=categoryWithAccounts')
    .reply(200, {
      _embedded: {
        accountCategories: [
          { id: 'cat-id-1', name: 'Category 1' },
          { id: 'cat-id-2', name: 'Category 2' },
          { id: 'cat-id-3', name: 'Category 3' },
        ],
      },
    });
  return (
    <Formik initialValues={{ category: 'cat-id-2' }} onSubmit={action('submit')}>
      <Form>
        <Field component={AccountCategorySelectField} label='Category' name='category' />
        <button type='submit'>submit</button>
      </Form>
    </Formik>
  );
};
