/* eslint-disable react/jsx-props-no-spreading */

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import React from 'react';

import getPeriodName from '../utils/getPeriodName';
import { values } from '../utils/periods';

const PeriodSelect = ({ periods, ...props }) => {
  const periodItems = React.useMemo(() =>
    [...Array(periods)].map((_, period) => getPeriodName(period, periods), [periods]),
  );
  return (
    <Select disabled={periods === 1} {...props}>
      {periodItems.map((label, i) => (
        <MenuItem key={label} value={i}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
};

PeriodSelect.propTypes = {
  periods: PropTypes.oneOf(values).isRequired,
};

export default PeriodSelect;
