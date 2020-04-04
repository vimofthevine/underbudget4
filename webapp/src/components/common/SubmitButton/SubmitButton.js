// Disable rule because this is a generic component
/* eslint-disable react/jsx-props-no-spreading */

import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const SubmitButton = ({ text, ...props }) => {
  const theme = useTheme();
  return (
    <Button
      color='primary'
      fullWidth
      style={{ marginTop: theme.spacing(3) }}
      type='submit'
      variant='contained'
      {...props}
    >
      {text}
    </Button>
  );
};

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default SubmitButton;
