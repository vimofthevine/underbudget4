import React from 'react';

import routePropType from '../../utils/route-prop-type';
import AppBar from './AppBar';
import NavCloseIconButton from './NavCloseIconButton';

const ActionPageAppBar = ({ back, ...props }) => (
  <AppBar leftButton={<NavCloseIconButton dest={back} />} {...props} />
);

ActionPageAppBar.propTypes = {
  back: routePropType.isRequired,
};

export default ActionPageAppBar;
