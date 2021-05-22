import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import { fieldToCheckbox } from 'formik-material-ui';
import React from 'react';
import PropTypes from 'prop-types';

const CheckboxWithTooltip = ({ title, ...props }) => (
  <Tooltip title={title}>
    <Checkbox {...fieldToCheckbox(props)} />
  </Tooltip>
);

CheckboxWithTooltip.propTypes = {
  title: PropTypes.string.isRequired,
};

export default CheckboxWithTooltip;
