import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import NextIcon from '@material-ui/icons/NavigateNext';
import PrevIcon from '@material-ui/icons/NavigateBefore';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import * as yup from 'yup';

import MoneyInputField from 'common/components/MoneyInputField';
import SubmitButton from 'common/components/SubmitButton';
import useMobile from 'common/hooks/useMobile';
import usePromptWhenDirty from 'common/hooks/usePromptWhenDirty';
import useReconciliationForm from '../hooks/useReconciliationForm';
import ReconciliationParameters from './ReconciliationParameters';
import UnreconciledTransactions from './UnreconciledTransactions';

const useStyles = makeStyles((theme) => ({
  stepButton: {
    marginLeft: 'auto',
  },
  submitButton: {
    marginTop: theme.spacing(1),
    marginLeft: 'auto',
  },
}));

const ReconciliationForm = ({ accountId }) => {
  const classes = useStyles();
  const mobile = useMobile();

  usePromptWhenDirty();

  const { setStep, setTransactions, step, transactions } = useReconciliationForm(accountId);
  const handleGoToPrevStep = () => setStep(step - 1);
  const handleGoToNextStep = () => setStep(step + 1);

  const isParamStep = step < 2;

  return (
    <Grid container spacing={1}>
      {(isParamStep || !mobile) && <ReconciliationParameters disabled={step > 1} />}
      <Grid container item xs={12}>
        <Button
          className={classes.stepButton}
          color='secondary'
          endIcon={isParamStep && <NextIcon />}
          fullWidth={mobile}
          onClick={isParamStep ? handleGoToNextStep : handleGoToPrevStep}
          startIcon={!isParamStep && <PrevIcon />}
          variant='contained'
        >
          {isParamStep ? 'Next' : 'Previous'}
        </Button>
      </Grid>
      {step === 2 && (
        <>
          <Grid item xs={12}>
            <UnreconciledTransactions
              accountId={accountId}
              onSelect={setTransactions}
              selected={transactions}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Field
              component={MoneyInputField}
              disabled
              fullWidth
              id='reconciled-balance'
              label='Reconciled Balance'
              margin='dense'
              name='reconciledBalance'
              variant='outlined'
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Field
              component={MoneyInputField}
              disabled
              fullWidth
              id='reconciled-balance-diff'
              label='Remaining To Be Reconciled'
              margin='dense'
              name='reconciledBalanceDiff'
              variant='outlined'
            />
          </Grid>
          <Grid container item xs={12}>
            <SubmitButton className={classes.submitButton} fullWidth={mobile} text='Create' />
          </Grid>
        </>
      )}
    </Grid>
  );
};

ReconciliationForm.propTypes = {
  accountId: PropTypes.number.isRequired,
};

ReconciliationForm.initialValues = {
  beginningBalance: 0,
  beginningDate: new Date(),
  endingBalance: 0,
  endingDate: new Date(),
  reconciledBalance: 0,
  reconciledBalanceDiff: 0,
  transactionIds: [],
};

ReconciliationForm.validationSchema = yup.object().shape({
  beginningBalance: yup.number().typeError('Required'),
  beginningDate: yup.date().typeError('Required').required('Required'),
  endingBalance: yup.number().typeError('Required'),
  endingDate: yup.date().typeError('Required').required('Required'),
  transactionIds: yup.array().of(yup.number()).typeError('Required'),
});

ReconciliationForm.validate = ({ reconciledBalanceDiff }) => {
  if (reconciledBalanceDiff !== 0) {
    return {
      reconciledBalance: 'Reconciled balance does not equal expected ending balance',
    };
  }
  return {};
};

export default ReconciliationForm;
