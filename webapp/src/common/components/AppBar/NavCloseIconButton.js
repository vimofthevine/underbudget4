import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

import routePropType from '../../utils/route-prop-type';
import NavIconButton from './NavIconButton';

const NavCloseIconButton = (props) => (
  <NavIconButton
    aria-label='cancel this operation'
    icon={<CloseIcon />}
    text='Cancel this operation'
    {...props}
  />
);

NavCloseIconButton.propTypes = {
  dest: routePropType.isRequired,
};

export default NavCloseIconButton;
