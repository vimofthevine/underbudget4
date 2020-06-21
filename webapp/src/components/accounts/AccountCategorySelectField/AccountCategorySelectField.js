/* eslint-disable react/jsx-props-no-spreading */
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import PropTypes from 'prop-types';
import React from 'react';

import useAccounts from '../hooks/useAccounts';

const AccountCategorySelectField = ({ id, label, name, ...props }) => {
  const { categories } = useAccounts();
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Field
        component={Select}
        disabled={categories.length === 0}
        inputProps={{ id }}
        name={name}
        {...props}
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </Field>
    </FormControl>
  );
};

AccountCategorySelectField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default AccountCategorySelectField;
