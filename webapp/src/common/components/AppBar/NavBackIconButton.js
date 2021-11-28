import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React from 'react';

import NavIconButton from './NavIconButton';

const NavBackIconButton = (props) => (
  <NavIconButton
    aria-label='go to previous page'
    icon={<ArrowBackIcon />}
    text='Go to previous page'
    {...props}
  />
);

NavBackIconButton.propTypes = NavIconButton.propTypes;

export default NavBackIconButton;
