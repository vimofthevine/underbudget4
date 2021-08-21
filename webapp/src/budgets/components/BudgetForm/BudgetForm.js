import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Field } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import React from 'react';
import * as yup from 'yup';

import { labels as periodLabels, values as periodValues } from '../../utils/periods';

const BudgetForm = () => (
  <>
    <Field
      autoComplete='off'
      autoFocus
      component={TextField}
      fullWidth
      id='budget-name'
      label='Name'
      margin='normal'
      name='name'
      placeholder='My budget'
      required
      variant='outlined'
    />
    <FormControl fullWidth required variant='outlined'>
      <InputLabel id='periods-label'>Periods Per Year</InputLabel>
      <Field
        aria-label='periods per year'
        component={Select}
        id='periods'
        label='Periods Per Year'
        labelId='periods-label'
        name='periods'
      >
        {periodValues.map((period) => (
          <MenuItem key={period} value={period}>
            {periodLabels[period]}
          </MenuItem>
        ))}
      </Field>
    </FormControl>
  </>
);

BudgetForm.initialValues = {
  name: '',
  periods: 12,
};

BudgetForm.validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  periods: yup.number().oneOf(periodValues).required('Required'),
});

export default BudgetForm;
