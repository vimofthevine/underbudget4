import { Formik } from 'formik';
import React from 'react';

import LedgerForm from './LedgerForm';

export default {
  title: 'ledgers/LedgerForm',
  component: LedgerForm,
};

export const NewLedger = () => (
  <Formik initialValues={{ name: '', currency: 840 }}>
    <LedgerForm />
  </Formik>
);

export const ModifyLedger = () => (
  <Formik initialValues={{ name: 'My Ledger', currency: 980 }}>
    <LedgerForm />
  </Formik>
);

export const WithErrors = () => (
  <Formik
    initialErrors={{ name: 'Bad name', currency: 'Bad currency' }}
    initialValues={{ name: '', currency: 1234 }}
  >
    <LedgerForm />
  </Formik>
);
