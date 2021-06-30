import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { DatePicker, KeyboardDatePicker } from 'formik-material-ui-pickers';
import React from 'react';
import * as yup from 'yup';

import useMobile from 'common/hooks/useMobile';
import transactionTypes, { testIfType, typeLabels } from '../../utils/transaction-types';
import AccountSplit from './AccountSplit';
import EnvelopeSplit from './EnvelopeSplit';
import ErrorMessage from './ErrorMessage';
import SplitList from './SplitList';
import useAutoType from './useAutoType';
import usePayeePlaceholder from './usePayeePlaceholder';
import useRevalidate from './useRevalidate';

const blankAccount = { accountId: 0, amount: 0, cleared: false, memo: '' };
const blankEnvelope = { amount: 0, envelopeId: 0, memo: '' };

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottomX: theme.spacing(1),
    marginTopX: theme.spacing(2),
  },
}));

const TransactionForm = () => {
  useAutoType();
  useRevalidate();
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
            aria-label='transaction type'
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
          autoFocus
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
      <SplitList
        addText='Add account'
        blank={blankAccount}
        name='accountTransactions'
        SplitComponent={AccountSplit}
      />
      <SplitList
        addText='Add envelope'
        blank={blankEnvelope}
        name='envelopeTransactions'
        SplitComponent={EnvelopeSplit}
      />
      <Grid item xs={12}>
        <ErrorMessage />
      </Grid>
    </Grid>
  );
};

TransactionForm.initialValues = {
  accountTransactions: [blankAccount],
  envelopeTransactions: [blankEnvelope],
  payee: '',
  recordedDate: new Date(),
  type: '',
};

TransactionForm.validationSchema = yup.object().shape({
  accountTransactions: yup
    .array()
    .of(
      yup.object().shape({
        accountId: yup.number().min(1, 'Required').required('Required'),
        amount: yup.number().typeError('Required'),
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
        amount: yup.number().typeError('Required'),
        envelopeId: yup.number().min(1, 'Required').required('Required'),
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
  recordedDate: yup.date().typeError('Required').required('Required'),
  type: yup.string().oneOf(transactionTypes).required('Required'),
});

TransactionForm.validate = ({ accountTransactions, envelopeTransactions }) => {
  const accountSum = accountTransactions
    ? accountTransactions.reduce((sum, acctTrn) => sum + acctTrn.amount, 0)
    : 0;
  const envelopeSum = envelopeTransactions
    ? envelopeTransactions.reduce((sum, envTrn) => sum + envTrn.amount, 0)
    : 0;
  const diff = accountSum - envelopeSum;
  if (diff !== 0) {
    if (accountTransactions.length === 0) {
      return { envelopeAmountToBalance: diff, sum: 'Sum of envelope splits does not equal zero' };
    }
    if (envelopeTransactions.length === 0) {
      return { accountAmountToBalance: -diff, sum: 'Sum of account splits does not equal zero' };
    }
    return {
      accountAmountToBalance: -diff,
      envelopeAmountToBalance: diff,
      sum: 'Sum of account splits does not equal sum of envelope splits',
    };
  }
  return {};
};

export default TransactionForm;
