// Disable rule because this is a generic component
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';

import EntitySelectField from 'common/components/EntitySelectField';
import useFlattenedEnvelopes from '../../hooks/useFlattenedEnvelopes';

const EnvelopeSelectField = (props) => {
  const envelopes = useFlattenedEnvelopes();
  return <EntitySelectField {...props} entities={envelopes} />;
};

export default EnvelopeSelectField;
