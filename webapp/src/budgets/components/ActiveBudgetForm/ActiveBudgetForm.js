import { Field } from 'formik';
import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';

import NumberInputField from 'common/components/NumberInputField';
import BudgetSelectField from '../BudgetSelectField';

const ActiveBudgetForm = ({ disableYear }) => (
  <>
    <Field
      autoFocus
      component={NumberInputField}
      disabled={disableYear}
      fullWidth
      id='active-budget-year'
      label='Year'
      margin='normal'
      name='year'
      required
      variant='outlined'
    />
    <Field
      component={BudgetSelectField}
      id='active-budget-id'
      label='Budget'
      name='budgetId'
      variant='outlined'
    />
  </>
);

ActiveBudgetForm.propTypes = {
  disableYear: PropTypes.bool,
};

ActiveBudgetForm.defaultProps = {
  disableYear: false,
};

ActiveBudgetForm.initialValues = {
  year: new Date().getFullYear(),
  budgetId: 0,
};

ActiveBudgetForm.validationSchema = yup.object().shape({
  year: yup.number().min(1900, 'Required'),
  budgetId: yup.number().min(1, 'Required'),
});

export default ActiveBudgetForm;
