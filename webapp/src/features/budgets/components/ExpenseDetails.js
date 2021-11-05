import Grid from '@material-ui/core/Grid';
import { FastField } from 'formik';
import { TextField } from 'formik-material-ui';
import PropTypes from 'prop-types';
import React from 'react';

import MoneyInputField from 'common/components/MoneyInputField';
import getPeriodName from '../utils/getPeriodName';
import useDetailSumAmount from '../hooks/useDetailSumAmount';

const ExpenseDetails = ({ periods }) => {
  useDetailSumAmount();

  const labels = React.useMemo(() => [...Array(periods)].map((_, i) => getPeriodName(i, periods)), [
    periods,
  ]);

  return (
    <Grid container spacing={1}>
      {[...Array(periods)].map((_, index) => (
        // This is OK here because it's a fixed-size array where order matters
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={index}>
          <Grid item sm={6} xs={12}>
            <FastField
              autoComplete='off'
              component={TextField}
              fullWidth
              id={`expense-detail-name-${index}`}
              label={labels[index]}
              margin='normal'
              name={`details[${index}].name`}
              variant='outlined'
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <FastField
              component={MoneyInputField}
              fullWidth
              id={`expense-detail-amount-${index}`}
              label='Amount'
              margin='normal'
              name={`details[${index}].amount`}
              variant='outlined'
            />
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
};

ExpenseDetails.propTypes = {
  periods: PropTypes.number.isRequired,
};

export default React.memo(ExpenseDetails);
