import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import ExpenseDetails from './ExpenseDetails';

const ExpenseDetailsSwitch = ({ disableDowngrade, periods }) => {
  const { setFieldValue, values } = useFormikContext();

  const hasDetails = values.details.length !== 0;

  const handleChangeDetails = () => {
    if (hasDetails) {
      setFieldValue('details', []);
    } else {
      const detailAmount = Math.floor(values.amount / periods);
      const details = [...Array(periods)].map(() => ({
        name: '',
        amount: detailAmount,
      }));
      setFieldValue('details', details);
    }
  };

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={hasDetails}
            color='primary'
            disabled={disableDowngrade && hasDetails}
            onChange={handleChangeDetails}
          />
        }
        label='Use period-specific amounts'
      />
      {hasDetails && <ExpenseDetails periods={periods} />}
    </>
  );
};

ExpenseDetailsSwitch.propTypes = {
  disableDowngrade: PropTypes.bool.isRequired,
  periods: PropTypes.number.isRequired,
};

export default ExpenseDetailsSwitch;
