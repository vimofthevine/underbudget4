import currencyCodes from 'currency-codes';
import React from 'react';

import useFetchLedger from './useFetchLedger';
import useSelectedLedger from './useSelectedLedger';

export default () => {
  const id = useSelectedLedger();
  const { data, isLoading } = useFetchLedger({ id });

  return React.useCallback(
    (intVal) => {
      if (isLoading) {
        return '...';
      }
      if (data) {
        const currency = currencyCodes.number(data.currency);
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currency.code,
        }).format(intVal / 10 ** currency.digits);
      }
      return '';
    },
    [data, isLoading],
  );
};
