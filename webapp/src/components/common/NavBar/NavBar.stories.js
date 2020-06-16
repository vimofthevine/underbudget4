import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { action, actions } from '@storybook/addon-actions';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import NavBar from './NavBar';

const navBarActions = actions('onToggleDrawer');

const ActionButton = () => (
  <IconButton edge='end' onClick={action('onActionClick')}>
    <MoreVertIcon />
  </IconButton>
);

export default {
  title: 'common/NavBar',
  component: NavBar,
  decorators: [(story) => <MemoryRouter>{story()}</MemoryRouter>],
};

export const WithPageTitle = () => <NavBar title='Page Title' {...navBarActions} />;

export const WithActionElement = () => (
  <NavBar {...navBarActions} actionElement={<ActionButton />} />
);
