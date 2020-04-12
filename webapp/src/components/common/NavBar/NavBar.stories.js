import { actions } from '@storybook/addon-actions';
import React from 'react';

import NavBar from './NavBar';

const navBarActions = actions('onToggleDrawer');

export default {
  title: 'common/NavBar',
  component: NavBar,
};

export const WithPageTitle = () => <NavBar title='Page Title' {...navBarActions} />;
