// Disable rule because this is a generic component
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';

import EntitySelectField from '../../../common/components/EntitySelectField';
import useEnvelopes from '../../hooks/useEnvelopes';

const EnvelopeCategorySelectField = (props) => {
  const { categories } = useEnvelopes();
  return <EntitySelectField {...props} entities={categories} />;
};

export default EnvelopeCategorySelectField;
