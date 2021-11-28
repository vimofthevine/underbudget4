import React from 'react';

import routePropType from '../../utils/route-prop-type';
import AppBar from './AppBar';
import NavBackIconButton from './NavBackIconButton';

const ChildPageAppBar = ({ back, ...props }) => (
  <AppBar leftButton={<NavBackIconButton dest={back} />} {...props} />
);

ChildPageAppBar.propTypes = {
  back: routePropType.isRequired,
  ...AppBar.propTypes,
};

export default ChildPageAppBar;
