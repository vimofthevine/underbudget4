import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { getIn, useFormikContext } from 'formik';
import React from 'react';
import PropTypes from 'prop-types';

import useFormatMoney from 'common/hooks/useFormatMoney';

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      marginBottom: theme.spacing(1),
      marginLeft: 0,
      marginTop: theme.spacing(1),
    },
  },
}));

const AddBalancingSplitButton = ({ balanceKey, blank, push }) => {
  const classes = useStyles();
  const formatMoney = useFormatMoney();
  const { errors } = useFormikContext();
  const balance = getIn(errors, balanceKey);
  if (balance) {
    return (
      <Button
        className={classes.button}
        color='secondary'
        onClick={() => push({ ...blank, amount: balance })}
        variant='contained'
      >
        {`Add balance (${formatMoney(balance)})`}
      </Button>
    );
  }
  return null;
};

AddBalancingSplitButton.propTypes = {
  balanceKey: PropTypes.string.isRequired,
  blank: PropTypes.shape({}).isRequired,
  push: PropTypes.func.isRequired,
};

export default AddBalancingSplitButton;
