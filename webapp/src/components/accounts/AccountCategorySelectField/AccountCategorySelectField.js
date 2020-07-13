// Disable rule because this is a generic component
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';

import useAccounts from '../../../accounts/hooks/useAccounts';
import EntitySelectField from '../../common/EntitySelectField';

const AccountCategorySelectField = (props) => {
  const { categories } = useAccounts();
  return <EntitySelectField {...props} entities={categories} />;
};

export default AccountCategorySelectField;
