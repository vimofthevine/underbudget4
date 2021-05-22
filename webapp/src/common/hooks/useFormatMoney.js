import currencyCodes from 'currency-codes';
import React from 'react';

import useSelectedLedger from './useSelectedLedger';
// This is a violation of my desired import structure, but doing this
// is better than having useFormatMoney in ledgers or useFetchLedger in common
import useFetchLedger from 'ledgers/hooks/useFetchLedger';

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
