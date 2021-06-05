import { useFormikContext } from 'formik';
import React from 'react';

export default function useRevalidate() {
  const {
    validateForm,
    values: { accountTransactions, envelopeTransactions },
  } = useFormikContext();

  // Re-run form validation if the number of splits changes (this doesn't happen
  // automatically since we turned off validateOnChange)
  React.useEffect(validateForm, [accountTransactions.length, envelopeTransactions.length]);
}
