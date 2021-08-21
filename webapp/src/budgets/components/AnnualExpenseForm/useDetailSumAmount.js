import { useFormikContext } from 'formik';
import React from 'react';

export default function useDetailSumAmount() {
  const { setFieldValue, values } = useFormikContext();

  React.useEffect(() => {
    if (values.details.length !== 0) {
      const sum = values.details.reduce((total, detail) => total + detail.amount, 0);
      setFieldValue('amount', sum);
    }
  }, [setFieldValue, values.details]);
}
