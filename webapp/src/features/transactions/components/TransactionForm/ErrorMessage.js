import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { getIn, useFormikContext } from 'formik';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(1),
  },
}));

const ErrorMessage = () => {
  const classes = useStyles();
  const { errors } = useFormikContext();
  const sumError = getIn(errors, 'sum');
  if (sumError) {
    return (
      <Alert className={classes.alert} severity='error'>
        {sumError}
      </Alert>
    );
  }
  return null;
};

export default ErrorMessage;
