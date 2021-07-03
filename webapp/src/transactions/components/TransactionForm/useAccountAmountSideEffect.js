import { useFormikContext } from 'formik';
import React from 'react';

const otherAccount = [1, 0];

export default function useAccountAmountSideEffect(index) {
  const {
    setFieldValue,
    values: { accountTransactions, envelopeTransactions },
  } = useFormikContext();

  return React.useCallback(
    ({ target: { value } }) => {
      if (Number.isInteger(value)) {
        if (accountTransactions.length === 1 && envelopeTransactions.length === 1) {
          setFieldValue('envelopeTransactions[0].amount', value);
        } else if (accountTransactions.length === 2 && envelopeTransactions.length === 0) {
          setFieldValue(`accountTransactions[${otherAccount[index]}].amount`, -value);
        }
      }
    },
    [accountTransactions.length, envelopeTransactions.length, index, setFieldValue],
  );
}
