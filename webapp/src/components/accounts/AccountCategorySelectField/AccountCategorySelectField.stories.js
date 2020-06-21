/* eslint-disable react/prop-types */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Formik } from 'formik';
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
      <AccountCategorySelectField id='category' label='Category' name='category' />
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
      <AccountCategorySelectField
        id='category'
        label='Category'
        name='category'
        variant='outlined'
      />
    </Formik>
  );
};

export const FewCategories = ({ mock }) => {
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
    <Formik initialValues={{ category: '' }}>
      <AccountCategorySelectField id='category' label='Category' name='category' />
    </Formik>
  );
};
