import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SubmitButton = ({ text, ...props }) => {
  const classes = useStyles();
  const { isSubmitting, isValid } = useFormikContext();
  return (
    <Button
      aria-label={text}
      className={classes.button}
      color='primary'
      disabled={isSubmitting || !isValid}
      fullWidth
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
