import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { Field, useField } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { DatePicker, KeyboardDatePicker } from 'formik-material-ui-pickers';
import React from 'react';
import * as yup from 'yup';

import useMobile from 'common/hooks/useMobile';
import transactionTypes, { testIfType, typeLabels } from '../../utils/transaction-types';
import SimpleDirectionalTransactionEntry from '../SimpleDirectionalTransactionEntry';
import SimpleOneSidedTransactionEntry from '../SimpleOneSidedTransactionEntry';
import SplitDirectionalTransactionEntry from '../SplitDirectionalTransactionEntry';
import SplitOneSidedTransactionEntry from '../SplitOneSidedTransactionEntry';
import usePayeePlaceholder from './usePayeePlaceholder';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottomX: theme.spacing(1),
    marginTopX: theme.spacing(2),
  },
}));

const SubTransactionEntry = () => {
  const [{ value: type }] = useField('type');
  const [{ value: split }] = useField('split');
  const typeIsExpense = testIfType.isExpense(type);
  if (testIfType.isIncome(type) || typeIsExpense) {
    return split ? (
      <SplitDirectionalTransactionEntry isExpense={typeIsExpense} />
    ) : (
      <SimpleDirectionalTransactionEntry isExpense={typeIsExpense} />
    );
  }
  if (testIfType.isTransfer(type) || testIfType.isAllocation(type)) {
    return split ? <SplitOneSidedTransactionEntry /> : <SimpleOneSidedTransactionEntry />;
  }
  return null;
};

const TransactionForm = () => {
  const classes = useStyles();
  const mobile = useMobile();

  return (
    <Grid container spacing={1}>
      <Grid item sm={4} xs={12}>
        <FormControl
          className={classes.formControl}
          fullWidth
          margin='dense'
          required
          variant='outlined'
        >
          <InputLabel id='transaction-type-label'>Type</InputLabel>
          <Field
            autoFocus
            component={Select}
            id='transaction-type'
            label='Type'
            labelId='transaction-type-label'
            name='type'
          >
            {transactionTypes.map((trnType) => (
              <MenuItem key={trnType} value={trnType}>
                {typeLabels[trnType]}
              </MenuItem>
            ))}
          </Field>
        </FormControl>
      </Grid>
      <Grid item sm={4} xs={12}>
        <Field
          component={TextField}
          fullWidth
          id='payee'
          label='Payee'
          margin='dense'
          name='payee'
          placeholder={usePayeePlaceholder()}
          required
          variant='outlined'
        />
      </Grid>
      <Grid item sm={4} xs={12}>
        <Field
          autoOk
          component={mobile ? DatePicker : KeyboardDatePicker}
          className={classes.formControl}
          disableToolbar
          format='yyyy-MM-DD'
          fullWidth
          id='recorded-date'
          inputVariant='outlined'
          label='Date'
          margin='dense'
          name='recordedDate'
          required
          variant={mobile ? 'dialog' : 'inline'}
        />
      </Grid>
      <SubTransactionEntry />
    </Grid>
  );
};

TransactionForm.initialValues = {
  accountTransactions: [{ accountId: 0, amount: 0, cleared: false, memo: '' }],
  envelopeTransactions: [{ amount: 0, envelopeId: 0, memo: '' }],
  payee: '',
  recordedDate: new Date(),
  split: false,
  type: 'expense',
};

TransactionForm.validationSchema = yup.object().shape({
  accountTransactions: yup
    .array()
    .of(
      yup.object().shape({
        accountId: yup.number().required('Required'),
        amount: yup.number(),
        cleared: yup.bool(),
        memo: yup.string(),
      }),
    )
    .when('type', (type, schema) => {
      if (testIfType.isTransfer(type)) {
        return schema.min(2);
      }
      if (testIfType.isAllocation(type)) {
        return schema.max(0);
      }
      return schema.min(1);
    }),
  envelopeTransactions: yup
    .array()
    .of(
      yup.object().shape({
        amount: yup.number(),
        envelopeId: yup.number().required('Required'),
        memo: yup.string(),
      }),
    )
    .when('type', (type, schema) => {
      if (testIfType.isAllocation(type)) {
        return schema.min(2);
      }
      if (testIfType.isTransfer(type)) {
        return schema.max(0);
      }
      return schema.min(1);
    }),
  payee: yup.string().required('Required'),
  recordedDate: yup.date().required('Required'),
  split: yup.bool(),
  type: yup.string().oneOf(transactionTypes).required('Required'),
});

TransactionForm.validate = (values) => {
  const accountSum = values.accountTransactions
    ? values.accountTransactions.reduce((sum, acctTrn) => sum + acctTrn.amount, 0)
    : 0;
  const envelopeSum = values.envelopeTransactions
    ? values.envelopeTransactions.reduce((sum, envTrn) => sum + envTrn.amount, 0)
    : 0;
  console.log('sum', { accountSum, envelopeSum });
  // 'Net sum of all account and envelope splits does not equal zero, transaction is not balanced',
  return {};
};

export default TransactionForm;
