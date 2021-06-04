import React from 'react';
import PropTypes from 'prop-types';

const FieldWithSideEffect = ({
  field: { onChange, ...field },
  FieldComponent,
  sideEffect,
  ...props
}) => (
  <FieldComponent
    {...props}
    field={{
      ...field,
      onChange: (e) => {
        onChange(e);
        sideEffect(e);
      },
    }}
  />
);

FieldWithSideEffect.propTypes = {
  field: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  FieldComponent: PropTypes.elementType.isRequired,
  sideEffect: PropTypes.func.isRequired,
};

export default FieldWithSideEffect;
