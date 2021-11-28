import React from 'react';

import AppBar from './AppBar';
import DrawerIconButton from './DrawerIconButton';

const TopLevelPageAppBar = (props) => <AppBar leftButton={<DrawerIconButton />} {...props} />;

TopLevelPageAppBar.propTypes = AppBar.propTypes;

export default TopLevelPageAppBar;
