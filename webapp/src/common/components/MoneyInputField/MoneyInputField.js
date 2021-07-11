import getSymbolFromCurrency from 'currency-symbol-map';
// import PropTypes from 'prop-types';
import React from 'react';

import useSelectedLedgerCurrency from '../../hooks/useSelectedLedgerCurrency';
import NumberInputField from '../NumberInputField';

const MoneyInputField = (props) => {
  const {
    currency: { code, digits },
    isValid,
  } = useSelectedLedgerCurrency();
  const symbol = React.useMemo(() => getSymbolFromCurrency(code), [code]);
  const fromValue = (v) => v / 10 ** digits;
  const toValue = (v) => Math.round(v * 10 ** digits);
  return (
    <NumberInputField
      fromValue={fromValue}
      numberInputProps={{
        decimalScale: digits,
        fixedDecimalScale: true,
        onFocus: (e) => e.target.select(),
        prefix: isValid ? symbol : null,
        thousandSeparator: true,
      }}
      toValue={toValue}
      {...props}
    />
  );
};

export default MoneyInputField;
