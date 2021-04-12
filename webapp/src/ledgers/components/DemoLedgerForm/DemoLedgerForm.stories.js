import { Formik } from 'formik';
import React from 'react';

import DemoLedgerForm from './DemoLedgerForm';

export default {
  title: 'ledgers/DemoLedgerForm',
  component: DemoLedgerForm,
};

export const NewDemo = () => (
  <Formik initialValues={{ name: '', currency: 840, months: 3, seed: 1234 }}>
    <DemoLedgerForm />
  </Formik>
);

export const WithErrors = () => (
  <Formik
    initialErrors={{
      name: 'Bad name',
      currency: 'Bad currency',
      months: 'Bad months',
      seed: 'Bad seed',
    }}
    initialTouched={{
      name: true,
      currency: true,
      months: true,
      seed: true,
    }}
    initialValues={{ name: '', currency: 840, months: 3, seed: 1234 }}
  >
    <DemoLedgerForm />
  </Formik>
);
