// Disable rule because this is a generic component
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';

import EntitySelectField from 'common/components/EntitySelectField';
import useAccounts from '../hooks/useAccounts';

const AccountCategorySelectField = (props) => {
  const { categories } = useAccounts();
  return <EntitySelectField {...props} entities={categories} />;
};

export default AccountCategorySelectField;
