import currency from 'currency-codes';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import * as yup from 'yup';

import CurrencyInputField from '../../../common/components/CurrencyInputField';

const LedgerForm = () => (
  <>
    <Field
      autoFocus
      component={TextField}
      id='ledger-name'
      fullWidth
      label='Name'
      margin='normal'
      name='name'
      placeholder='My ledger'
      required
      variant='outlined'
    />
    <Field
      autoCompleteProps={{
        fullWidth: false,
      }}
      component={CurrencyInputField}
      fullWidth={false}
      helperText='Currency for all accounts and transactions in the ledger'
      id='ledger-currency'
      label='Currency'
      margin='normal'
      name='currency'
      required
      variant='outlined'
    />
  </>
);

LedgerForm.validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  currency: yup
    .number()
    .oneOf(
      currency.numbers().map((n) => Number(n)),
      'Must be a valid currency',
    )
    .required('Required'),
});

export default LedgerForm;
