import currencyCodes from 'currency-codes';
import React from 'react';

// This is a violation of my desired import structure, but doing this
// is better than having useFormatMoney in ledgers or useFetchLedger in common
import { useFetchLedger } from 'features/ledgers';
import useSelectedLedger from './useSelectedLedger';

export default () => {
  const id = useSelectedLedger();
  const { data, isLoading } = useFetchLedger({ id });

  return React.useMemo(
    () => ({
      currency: data ? currencyCodes.number(data.currency) : currencyCodes.code('USD'),
      isLoading,
      isValid: !!data,
    }),
    [data, isLoading],
  );
};
