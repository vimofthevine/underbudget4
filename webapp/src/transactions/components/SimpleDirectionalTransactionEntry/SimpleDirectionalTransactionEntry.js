import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import { CheckboxWithLabel, Switch, TextField } from 'formik-material-ui';
import React from 'react';
import PropTypes from 'prop-types';

const SimpleDirectionalTransactionEntry = ({ isExpense }) => (
  <>
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Field
            component={Switch}
            id='simple-directional-transaction-split'
            name='split'
            type='checkbox'
          />
        }
        label='Split?'
      />
    </Grid>
    <Grid item sm={4} xs={12}>
      <Field
        component={TextField}
        fullWidth
        id='simple-directional-transaction-account-id'
        label='Account'
        margin='dense'
        name='accountTransactions[0].accountId'
        variant='outlined'
      />
    </Grid>
    <Grid item sm={4} xs={12}>
      <Field
        component={TextField}
        fullWidth
        id='simple-directional-transaction-memo'
        label='Memo'
        margin='dense'
        name='accountTransactions[0].memo'
        placeholder={isExpense ? 'expense memo' : 'income memo'}
        variant='outlined'
      />
    </Grid>
    <Grid item sm={3} xs={12}>
      <Field
        component={TextField}
        fullWidth
        id='simple-directional-transaction-amount'
        label='Amount'
        margin='dense'
        name='accountTransactions[0].amount'
        variant='outlined'
      />
    </Grid>
    <Grid item sm={1} xs={12}>
      <Field
        component={CheckboxWithLabel}
        id='simple-directional-transaction-cleared'
        Label={{ label: 'Cleared' }}
        name='accountTransactions[0].cleared'
        type='checkbox'
      />
    </Grid>
    <Grid item sm={4} xs={12}>
      <Field
        component={TextField}
        fullWidth
        id='simple-directional-transaction-envelope-id'
        label='Envelope'
        margin='dense'
        name='envelopeTransactions[0].envelopeId'
        variant='outlined'
      />
    </Grid>
  </>
);

SimpleDirectionalTransactionEntry.propTypes = {
  isExpense: PropTypes.bool.isRequired,
};

export default SimpleDirectionalTransactionEntry;
