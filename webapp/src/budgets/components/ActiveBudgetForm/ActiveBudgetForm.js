import { Field } from 'formik';
import React from 'react';
import * as yup from 'yup';

import NumberInputField from 'common/components/NumberInputField';
import BudgetSelectField from '../BudgetSelectField';

const BudgetForm = () => (
  <>
    <Field
      autoFocus
      component={NumberInputField}
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

BudgetForm.initialValues = {
  year: new Date().getFullYear(),
  budgetId: 0,
};

BudgetForm.validationSchema = yup.object().shape({
  year: yup.number().min(1900, 'Required'),
  budgetId: yup.number().min(1, 'Required'),
});

export default BudgetForm;
