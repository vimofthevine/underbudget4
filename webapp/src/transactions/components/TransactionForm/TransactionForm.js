import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { DatePicker, KeyboardDatePicker } from 'formik-material-ui-pickers';
import React from 'react';
import * as yup from 'yup';

import useMobile from 'common/hooks/useMobile';
import transactionTypes from '../../utils/transaction-types';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBotto: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

const TransactionForm = () => {
  const classes = useStyles();
  const mobile = useMobile();

  return (
    <>
      <Field
        autoComplete='off'
        autoFocus
        component={TextField}
        fullWidth
        id='payee'
        label='Payee'
        margin='normal'
        name='payee'
        placeholder='Transaction payee'
        required
        variant='outlined'
      />
      <Field
        autoOk
        component={mobile ? DatePicker : KeyboardDatePicker}
        disableToolbar
        format='yyyy-MM-DD'
        fullWidth
        id='recorded-date'
        inputVariant='outlined'
        label='Date'
        name='recordedDate'
        required
        variant={mobile ? 'dialog' : 'inline'}
      />
      <FormControl className={classes.formControl} fullWidth required variant='outlined'>
        <InputLabel id='transaction-type-label'>Type</InputLabel>
        <Field
          component={Select}
          id='transaction-type'
          label='Type'
          labelId='transaction-type-label'
          name='type'
        >
          {transactionTypes.map((trnType) => (
            <MenuItem key={trnType} value={trnType}>
              {trnType.replace('_', ' ')}
            </MenuItem>
          ))}
        </Field>
      </FormControl>
    </>
  );
};

TransactionForm.initialValues = {
  payee: '',
  recordedDate: new Date(),
  type: 'expense',
};

TransactionForm.validationSchema = yup.object().shape({
  payee: yup.string().required('Required'),
  recordedDate: yup.date().required('Required'),
  type: yup.string().oneOf(transactionTypes).required('Required'),
});

export default TransactionForm;
