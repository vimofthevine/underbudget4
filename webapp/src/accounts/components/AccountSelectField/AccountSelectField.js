// Disable rule because this is a generic component
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';

import EntitySelectField from 'common/components/EntitySelectField';
import useFlattenedAccounts from '../../hooks/useFlattenedAccounts';

const AccountSelectField = (props) => {
  const accounts = useFlattenedAccounts();
  return <EntitySelectField {...props} entities={accounts} />;
};

export default AccountSelectField;
