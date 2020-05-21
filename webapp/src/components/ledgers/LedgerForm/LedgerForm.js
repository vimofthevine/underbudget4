import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';

import CurrencyInputField from '../../common/CurrencyInputField';

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

export default LedgerForm;
