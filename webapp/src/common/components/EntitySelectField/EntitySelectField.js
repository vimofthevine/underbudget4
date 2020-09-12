// Disable rule because this is a generic component
/* eslint-disable react/jsx-props-no-spreading */

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getIn } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

const EntitySelectField = ({
  autoCompleteProps,
  disabled,
  entities,
  helperText,
  field: { onBlur, name, value },
  form: { errors, isSubmitting, setFieldValue, touched },
  ...props
}) => {
  const errorText = getIn(errors, name);
  const showError = getIn(touched, name) && !!errorText;

  const selected = entities.find((e) => e.id === value) || null;

  const handleChange = (_, v) => {
    if (typeof v === 'string') {
      const entity = entities.find((e) => e.name === v);
      setFieldValue(name, entity ? entity.id : value);
    } else {
      setFieldValue(name, v ? v.id : value);
    }
  };

  return (
    <Autocomplete
      {...autoCompleteProps}
      disabled={disabled || isSubmitting}
      getOptionLabel={(o) => (o ? o.name : '')}
      getOptionSelected={(opt, val) => opt.id === val.id}
      options={entities}
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
      onChange={handleChange}
      onInputChange={(e) => e && handleChange(e, e.target.value)}
      value={selected}
    />
  );
};

EntitySelectField.propTypes = {
  autoCompleteProps: PropTypes.shape({}),
  disabled: PropTypes.bool,
  entities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    value: PropTypes.string.isRequired,
  }).isRequired,
  form: PropTypes.shape({
    errors: PropTypes.shape({}),
    isSubmitting: PropTypes.bool,
    setFieldValue: PropTypes.func.isRequired,
    touched: PropTypes.shape({}),
  }).isRequired,
  helperText: PropTypes.string,
};

EntitySelectField.defaultProps = {
  autoCompleteProps: null,
  disabled: false,
  helperText: null,
};

export default EntitySelectField;
