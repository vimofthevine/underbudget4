import currency from 'currency-codes';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import * as yup from 'yup';

import CurrencyInputField from 'common/components/CurrencyInputField';
import NumberInputField from 'common/components/NumberInputField';

const DemoLedgerForm = () => (
  <>
    <Field
      autoFocus
      component={TextField}
      id='demo-ledger-name'
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
      id='demo-ledger-currency'
      label='Currency'
      margin='normal'
      name='currency'
      required
      variant='outlined'
    />
    <Field
      component={NumberInputField}
      fullWidth
      helperText='Number of months of demo transactions to be generated'
      id='demo-num-months'
      label='Number of Months'
      margin='normal'
      name='months'
      required
      variant='outlined'
    />
    <Field
      component={NumberInputField}
      fullWidth
      helperText='Randomization seed to be used to generate demo transactions'
      id='demo-seed'
      label='Randomization Seed'
      margin='normal'
      name='seed'
      required
      variant='outlined'
    />
  </>
);

DemoLedgerForm.validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  currency: yup
    .number()
    .oneOf(
      currency.numbers().map((n) => Number(n)),
      'Must be a valid currency',
    )
    .required('Required'),
  months: yup.number().min(3).required('Required'),
  seed: yup.number().required('Required'),
});

export default DemoLedgerForm;
