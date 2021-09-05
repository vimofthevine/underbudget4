import { Field, useField } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import MoneyInputField from 'common/components/MoneyInputField';
import { labels } from '../utils/periods';

const AnnualAmountField = ({ periods }) => {
  const [field] = useField('details');
  const hasDetails = field.value.length !== 0;
  return (
    <Field
      component={MoneyInputField}
      disabled={hasDetails}
      fullWidth
      helperText={hasDetails ? '' : `Evenly divided over ${labels[periods].toLowerCase()} periods`}
      id='expense-amount'
      label='Amount'
      margin='normal'
      name='amount'
      required
      variant='outlined'
    />
  );
};

AnnualAmountField.propTypes = {
  periods: PropTypes.number.isRequired,
};

export default AnnualAmountField;
