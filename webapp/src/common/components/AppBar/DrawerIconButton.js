import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';

import { useDrawerState } from '../../contexts/drawer';
import LeftIconButton from './LeftIconButton';

const DrawerIconButton = () => {
  const [, toggleDrawer] = useDrawerState();

  return (
    <LeftIconButton
      aria-label='toggle nav drawer'
      icon={<MenuIcon />}
      onClick={toggleDrawer}
      text='Toggle nav drawer'
    />
  );
};

export default DrawerIconButton;
