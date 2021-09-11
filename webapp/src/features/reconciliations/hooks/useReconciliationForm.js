import { useFormikContext } from 'formik';
import moment from 'moment';
import React from 'react';

import calculateNextReconciliationDates from '../utils/calculateNextReconciliationDates';
import useFetchLastReconciliation from './useFetchLastReconciliation';
import useFetchClearedTransactions from './useFetchClearedTransactions';

export default (accountId) => {
  const [transactions, setTransactions] = React.useState([]);
  const [step, setStep] = React.useState(0);

  const { setFieldValue, setValues, values } = useFormikContext();
  const { beginningBalance, endingDate } = values;

  // Step 0, fetch last reconciliation and pre-populate some fields
  useFetchLastReconciliation({
    accountId,
    enabled: step === 0,
    onError: () => setStep(1),
    onSuccess: (resp) => {
      setValues({
        ...values,
        beginningBalance: resp.endingBalance,
        endingBalance: resp.endingBalance,
        ...calculateNextReconciliationDates(resp.endingDate),
      });
      setStep(1);
    },
  });

  // Step 1, fetch cleared transactions to populate ending balance
  useFetchClearedTransactions({
    accountId,
    endingDate: moment(endingDate).format('YYYY-MM-DD'),
    enabled: step === 1,
    onSuccess: (resp) => {
      setFieldValue(
        'endingBalance',
        beginningBalance + resp.transactions.reduce((total, trn) => total + trn.amount, 0),
      );
      setTransactions(resp.transactions);
    },
  });

  // Step 2, re-calculate reconciled balance from selected transactions
  React.useEffect(() => {
    if (step === 2) {
      setValues({
        ...values,
        reconciledBalance:
          beginningBalance + transactions.reduce((total, trn) => total + trn.amount, 0),
        transactionIds: transactions.map((t) => t.id),
      });
    }
  }, [beginningBalance, step, transactions]);

  return {
    setStep,
    setTransactions,
    step,
    transactions,
  };
};
