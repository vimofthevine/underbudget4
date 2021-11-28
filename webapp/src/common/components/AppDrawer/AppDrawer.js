import React from 'react';

import { useDrawerState } from '../../contexts/drawer';
import useMobile from '../../hooks/useMobile';
import NavIconList from '../NavIconList';
import PureDrawer from '../PureDrawer';

const AppDrawer = () => {
  const [open, toggleDrawer] = useDrawerState();
  const mobile = useMobile();

  return (
    <PureDrawer
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
      open={open}
      variant={mobile ? 'temporary' : 'permanent'}
    >
      <NavIconList />
    </PureDrawer>
  );
};

export default AppDrawer;
