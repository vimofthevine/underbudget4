// Disable rule because this is a generic component
/* eslint-disable react/jsx-props-no-spreading */

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import currency from 'currency-codes';
import { getIn } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

const CurrencyInputField = ({
  autoCompleteProps,
  disabled,
  helperText,
  field: { onBlur, name, value },
  form: { errors, isSubmitting, setFieldValue, touched },
  ...props
}) => {
  const errorText = getIn(errors, name);
  const showError = getIn(touched, name) && !!errorText;

  const currencyType = currency.number(value);

  const handleChange = (_, v) => {
    if (v) {
      const newCurrency = currency.code(v);
      if (newCurrency) {
        setFieldValue(name, Number(newCurrency.number));
      }
    }
  };

  return (
    <Autocomplete
      {...autoCompleteProps}
      autoSelect
      disabled={disabled || isSubmitting}
      options={currency.codes()}
      renderInput={(params) => (
        <TextField
          error={showError}
          helperText={showError ? errorText : helperText}
          name={name}
          onBlur={onBlur}
          {...params}
          {...props}
        />
      )}
      selectOnFocus
      onChange={handleChange}
      onInputChange={(e) => e && handleChange(e, e.target.value)}
      value={currencyType ? currencyType.code : null}
    />
  );
};

CurrencyInputField.propTypes = {
  autoCompleteProps: PropTypes.shape({}),
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    value: PropTypes.number.isRequired,
  }).isRequired,
  form: PropTypes.shape({
    errors: PropTypes.shape({}),
    isSubmitting: PropTypes.bool,
    setFieldValue: PropTypes.func.isRequired,
    touched: PropTypes.shape({}),
  }).isRequired,
};

CurrencyInputField.defaultProps = {
  autoCompleteProps: null,
  disabled: false,
  helperText: null,
};

export default CurrencyInputField;
