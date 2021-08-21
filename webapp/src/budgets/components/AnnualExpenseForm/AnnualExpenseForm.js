import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import * as yup from 'yup';

import EnvelopeSelectField from 'envelopes/components/EnvelopeSelectField';
import AnnualAmountField from './AnnualAmountField';
import ExpenseDetailsSwitch from './ExpenseDetailsSwitch';

const PeriodicExpenseForm = ({ disableDetailsSwitch, periods }) => (
  <>
    <Field
      autoComplete='off'
      autoFocus
      component={TextField}
      fullWidth
      id='expense-name'
      label='Name'
      margin='normal'
      name='name'
      placeholder='Expense name'
      required
      variant='outlined'
    />
    <Field
      component={EnvelopeSelectField}
      fullWidth
      id='expense-envelope-id'
      label='Envelope'
      margin='normal'
      name='envelopeId'
      required
      variant='outlined'
    />
    <AnnualAmountField periods={periods} />
    <ExpenseDetailsSwitch disableDetailsSwitch={disableDetailsSwitch} periods={periods} />
  </>
);

PeriodicExpenseForm.propTypes = {
  disableDetailsSwitch: PropTypes.bool,
  periods: PropTypes.number.isRequired,
};

PeriodicExpenseForm.defaultProps = {
  disableDetailsSwitch: false,
};

PeriodicExpenseForm.initialValues = {
  name: '',
  envelopeId: 0,
  amount: 0,
  details: [],
};

PeriodicExpenseForm.validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  envelopeId: yup.number().min(1, 'Required').required('Required'),
  amount: yup.number().typeError('Required').min(1, 'Must be a positive amount'),
  details: yup.array().of(
    yup.object().shape({
      name: yup.string(),
      amount: yup.number().typeError('Required').min(0, 'Must be a positive amount'),
    }),
  ),
});

export default PeriodicExpenseForm;
