import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import PropTypes from 'prop-types';

import FieldWithSideEffect from 'common/components/FieldWithSideEffect';
import MoneyInputField from 'common/components/MoneyInputField';
import EnvelopeSelectField from 'envelopes/components/EnvelopeSelectField';

import useEnvelopeAmountSideEffect from './useEnvelopeAmountSideEffect';

const EnvelopeSplit = ({ disableRemove, index, onRemove }) => (
  <>
    <Grid item md={4} sm={6} xs={12}>
      <Field
        component={EnvelopeSelectField}
        fullWidth
        id={`envelope-id-${index}`}
        label='Envelope'
        margin='dense'
        name={`envelopeTransactions[${index}].envelopeId`}
        variant='outlined'
      />
    </Grid>
    <Grid item md={4} sm={6} xs={12}>
      <Field
        component={TextField}
        fullWidth
        id={`envelope-memo-${index}`}
        label='Memo'
        margin='dense'
        name={`envelopeTransactions[${index}].memo`}
        variant='outlined'
      />
    </Grid>
    <Grid item md={3} sm={6} xs={12}>
      <Field
        component={FieldWithSideEffect}
        FieldComponent={MoneyInputField}
        fullWidth
        id={`envelope-amount-${index}`}
        label='Amount'
        margin='dense'
        name={`envelopeTransactions[${index}].amount`}
        sideEffect={useEnvelopeAmountSideEffect(index)}
        variant='outlined'
      />
    </Grid>
    <Grid item md={1} sm={6} xs={12}>
      <IconButton
        aria-label='Delete envelope split'
        disabled={disableRemove}
        onClick={onRemove}
        style={{ marginLeft: 'auto' }}
      >
        <DeleteIcon />
      </IconButton>
    </Grid>
  </>
);

EnvelopeSplit.propTypes = {
  disableRemove: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default EnvelopeSplit;
