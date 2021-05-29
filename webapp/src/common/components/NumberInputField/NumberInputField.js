import { TextField } from 'formik-material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import NumberFormat from 'react-number-format';

const NumberInput = ({ inputRef, onChange, ...props }) => (
  <NumberFormat
    {...props}
    getInputRef={inputRef}
    isNumericString
    onBlur={() => console.log('onblur was called')}
    onChange={(e) => console.log('onchange was called', e.target.value)}
    onValueChange={(values) => {
      console.log('onValueChange', values);
      onChange({
        target: {
          name: props.name,
          value: values.floatValue,
        },
      });
    }}
  />
);

NumberInput.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const NumberInputField = ({
  field: { onChange, value, ...field },
  fromValue,
  numberInputProps,
  toValue,
  ...props
}) => (
  <TextField
    {...props}
    field={{
      ...field,
      onChange: ({ target: { name: targetName, value: targetValue } }) =>
        onChange({ target: { name: targetName, value: toValue(targetValue) } }),
      value: fromValue(value),
    }}
    InputProps={{
      inputComponent: NumberInput,
      inputProps: {
        ...numberInputProps,
      },
    }}
  />
);

NumberInputField.propTypes = {
  field: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
  fromValue: PropTypes.func,
  numberInputProps: PropTypes.shape({}),
  toValue: PropTypes.func,
};

NumberInputField.defaultProps = {
  fromValue: (v) => v,
  numberInputProps: {},
  toValue: (v) => v,
};

export default NumberInputField;
