import { useFormikContext } from 'formik';
import React from 'react';

const otherEnvelope = [1, 0];

export default function useEnvelopeAmountSideEffect(index) {
  const {
    setFieldValue,
    values: { accountTransactions, envelopeTransactions },
  } = useFormikContext();

  return React.useCallback(
    ({ target: { value } }) => {
      if (Number.isInteger(value)) {
        if (accountTransactions.length === 1 && envelopeTransactions.length === 1) {
          setFieldValue('accountTransactions[0].amount', value);
        } else if (accountTransactions.length === 0 && envelopeTransactions.length === 2) {
          setFieldValue(`envelopeTransactions[${otherEnvelope[index]}].amount`, -value);
        }
      }
    },
    [accountTransactions.length, envelopeTransactions.length, index, setFieldValue],
  );
}
