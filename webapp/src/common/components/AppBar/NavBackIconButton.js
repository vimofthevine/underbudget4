import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React from 'react';

import routePropType from '../../utils/route-prop-type';
import NavIconButton from './NavIconButton';

const NavBackIconButton = (props) => (
  <NavIconButton
    aria-label='go to previous page'
    icon={<ArrowBackIcon />}
    text='Go to previous page'
    {...props}
  />
);

NavBackIconButton.propTypes = {
  dest: routePropType.isRequired,
};

export default NavBackIconButton;
