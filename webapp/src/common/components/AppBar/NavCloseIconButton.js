import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

import NavIconButton from './NavIconButton';

const NavCloseIconButton = (props) => (
  <NavIconButton
    aria-label='cancel this operation'
    icon={<CloseIcon />}
    text='Cancel this operation'
    {...props}
  />
);

NavCloseIconButton.propTypes = NavIconButton.propTypes;

export default NavCloseIconButton;
