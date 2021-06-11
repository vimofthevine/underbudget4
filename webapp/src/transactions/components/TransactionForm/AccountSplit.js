import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import PropTypes from 'prop-types';

import AccountSelectField from 'accounts/components/AccountSelectField';
import CheckboxWithTooltip from 'common/components/CheckboxWithTooltip';
import FieldWithSideEffect from 'common/components/FieldWithSideEffect';
import MoneyInputField from 'common/components/MoneyInputField';

import useAccountAmountSideEffect from './useAccountAmountSideEffect';

const AccountSplit = ({ disableRemove, index, onRemove }) => (
  <>
    <Grid item md={4} sm={6} xs={12}>
      <Field
        component={AccountSelectField}
        fullWidth
        id={`account-id-${index}`}
        label='Account'
        margin='dense'
        name={`accountTransactions[${index}].accountId`}
        variant='outlined'
      />
    </Grid>
    <Grid item md={4} sm={6} xs={12}>
      <Field
        component={TextField}
        fullWidth
        id={`account-memo-${index}`}
        label='Memo'
        margin='dense'
        name={`accountTransactions[${index}].memo`}
        variant='outlined'
      />
    </Grid>
    <Grid item md={3} sm={6} xs={12}>
      <Field
        component={FieldWithSideEffect}
        FieldComponent={MoneyInputField}
        fullWidth
        id={`account-amount-${index}`}
        label='Amount'
        margin='dense'
        name={`accountTransactions[${index}].amount`}
        sideEffect={useAccountAmountSideEffect(index)}
        variant='outlined'
      />
    </Grid>
    <Grid container item md={1} sm={6} xs={12}>
      <Field
        component={CheckboxWithTooltip}
        id={`account-cleared-${index}`}
        name={`accountTransactions[${index}].cleared`}
        title='Is cleared?'
        type='checkbox'
      />
      <IconButton
        aria-label='Delete account split'
        disabled={disableRemove}
        onClick={onRemove}
        style={{ marginLeft: 'auto' }}
      >
        <DeleteIcon />
      </IconButton>
    </Grid>
  </>
);

AccountSplit.propTypes = {
  disableRemove: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default AccountSplit;
