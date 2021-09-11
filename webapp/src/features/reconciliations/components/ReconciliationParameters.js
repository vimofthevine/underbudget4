import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';
import { DatePicker, KeyboardDatePicker } from 'formik-material-ui-pickers';
import PropTypes from 'prop-types';
import React from 'react';

import MoneyInputField from 'common/components/MoneyInputField';
import useMobile from 'common/hooks/useMobile';

const ReconciliationParameters = ({ disabled }) => {
  const mobile = useMobile();
  const DatePickerComponent = mobile ? DatePicker : KeyboardDatePicker;

  return (
    <>
      <Grid item sm={6} xs={12}>
        <Field
          autoOk
          component={DatePickerComponent}
          disabled={disabled}
          disableToolbar
          format='yyyy-MM-DD'
          fullWidth
          id='beginning-date'
          inputVariant='outlined'
          label='Beginning Date'
          margin='dense'
          name='beginningDate'
          required
          variant={mobile ? 'dialog' : 'inline'}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Field
          component={MoneyInputField}
          disabled={disabled}
          fullWidth
          id='beginning-balance'
          label='Beginning Balance'
          margin='dense'
          name='beginningBalance'
          variant='outlined'
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Field
          autoOk
          component={DatePickerComponent}
          disabled={disabled}
          disableToolbar
          format='yyyy-MM-DD'
          fullWidth
          id='ending-date'
          inputVariant='outlined'
          label='Ending Date'
          margin='dense'
          name='endingDate'
          required
          variant={mobile ? 'dialog' : 'inline'}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Field
          component={MoneyInputField}
          disabled={disabled}
          fullWidth
          id='ending-balance'
          label='Ending Balance'
          margin='dense'
          name='endingBalance'
          variant='outlined'
        />
      </Grid>
    </>
  );
};

ReconciliationParameters.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

export default ReconciliationParameters;
