import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTheme } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

const SubmitButton = ({ text, ...props }) => {
  const theme = useTheme();
  const { isSubmitting, isValid } = useFormikContext();
  return (
    <Button
      aria-label={text}
      color='primary'
      disabled={isSubmitting || !isValid}
      fullWidth
      style={{ margin: theme.spacing(3, 0, 2) }}
      type='submit'
      variant='contained'
      {...props}
    >
      {isSubmitting ? <CircularProgress color='secondary' /> : text}
    </Button>
  );
};

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default SubmitButton;
