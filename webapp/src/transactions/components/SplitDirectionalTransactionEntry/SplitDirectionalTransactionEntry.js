import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { Field } from 'formik';
import { Switch, TextField } from 'formik-material-ui';
import React from 'react';
import PropTypes from 'prop-types';

import AccountSelectField from 'accounts/components/AccountSelectField';
import CheckboxWithTooltip from 'common/components/CheckboxWithTooltip';
import EnvelopeSelectField from 'envelopes/components/EnvelopeSelectField';

const SplitDirectionalTransactionEntry = ({ isExpense }) => (
  <>
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Field
            component={Switch}
            id='split-directional-transaction-split'
            name='split'
            type='checkbox'
          />
        }
        label='Split?'
      />
    </Grid>
    <Grid item md={4} sm={6} xs={12}>
      <Field
        component={AccountSelectField}
        fullWidth
        id='split-directional-transaction-account-id'
        label='Account'
        margin='dense'
        name='accountTransactions[0].accountId'
        variant='outlined'
      />
    </Grid>
    <Grid item md={4} sm={6} xs={12}>
      <Field
        component={TextField}
        fullWidth
        id='split-directional-transaction-account-memo'
        label='Memo'
        margin='dense'
        name='accountTransactions[0].memo'
        placeholder={isExpense ? 'expense memo' : 'income memo'}
        variant='outlined'
      />
    </Grid>
    <Grid item md={3} sm={6} xs={12}>
      <Field
        component={TextField}
        fullWidth
        id='split-directional-transaction-account-amount'
        label='Amount'
        margin='dense'
        name='accountTransactions[0].amount'
        variant='outlined'
      />
    </Grid>
    <Grid container item md={1} sm={6} xs={12}>
      <Field
        component={CheckboxWithTooltip}
        id='split-directional-transaction-cleared'
        name='accountTransactions[0].cleared'
        title='Is cleared?'
        type='checkbox'
      />
      <Tooltip title='Delete'>
        <IconButton style={{ marginLeft: 'auto' }}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Grid>

    <Grid item sm={12}>
      <Button color='secondary' startIcon={<AddIcon />} variant='contained'>
        Add account split
      </Button>
    </Grid>

    <Grid item md={4} sm={6} xs={12}>
      <Field
        component={EnvelopeSelectField}
        fullWidth
        id='split-directional-transaction-envelope-id'
        label='Envelope'
        margin='dense'
        name='envelopeTransactions[0].envelopeId'
        variant='outlined'
      />
    </Grid>
    <Grid item md={4} sm={6} xs={12}>
      <Field
        component={TextField}
        fullWidth
        id='split-directional-transaction-envelope-memo'
        label='Memo'
        margin='dense'
        name='envelopeTransactions[0].memo'
        placeholder={isExpense ? 'expense memo' : 'income memo'}
        variant='outlined'
      />
    </Grid>
    <Grid item md={3} sm={6} xs={12}>
      <Field
        component={TextField}
        fullWidth
        id='split-directional-transaction-envelope-amount'
        label='Amount'
        margin='dense'
        name='envelopeTransactions[0].amount'
        variant='outlined'
      />
    </Grid>
    <Grid container item md={1} sm={6} xs={12}>
      <IconButton style={{ marginLeft: 'auto' }}>
        <DeleteIcon />
      </IconButton>
    </Grid>

    <Grid item sm={12}>
      <Button color='secondary' startIcon={<AddIcon />} variant='contained'>
        Add envelope split
      </Button>
    </Grid>
  </>
);

SplitDirectionalTransactionEntry.propTypes = {
  isExpense: PropTypes.bool.isRequired,
};

export default SplitDirectionalTransactionEntry;
