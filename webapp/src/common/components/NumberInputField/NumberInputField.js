import { TextField } from 'formik-material-ui';
import PropTypes from 'prop-types';
import React from 'react';
import NumberFormat from 'react-number-format';

const NumberInput = ({ inputRef, onChange, ...props }) => (
  <NumberFormat
    {...props}
    getInputRef={inputRef}
    isNumericString
    onValueChange={(values) => {
      onChange({
        target: {
          name: props.name,
          value: values.value,
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

const NumberInputField = ({ numberInputProps, ...props }) => (
  <TextField
    {...props}
    InputProps={{
      inputComponent: NumberInput,
      inputProps: {
        ...numberInputProps,
      },
    }}
  />
);

NumberInputField.propTypes = {
  numberInputProps: PropTypes.shape({}),
};

NumberInputField.defaultProps = {
  numberInputProps: {},
};

export default NumberInputField;
