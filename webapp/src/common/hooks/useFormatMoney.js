import React from 'react';

import useSelectedLedgerCurrency from './useSelectedLedgerCurrency';

export default () => {
  const { currency, isLoading } = useSelectedLedgerCurrency();

  return React.useCallback(
    (intVal) => {
      if (isLoading) {
        return '...';
      }
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency.code,
      }).format(intVal / 10 ** currency.digits);
    },
    [currency, isLoading],
  );
};
