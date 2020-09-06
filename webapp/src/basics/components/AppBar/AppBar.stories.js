import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import MenuIcon from '@material-ui/icons/Menu';
import { action } from '@storybook/addon-actions';
import React from 'react';

import AppBar from './AppBar';

export default {
  title: 'basics/AppBar',
  component: AppBar,
};

const Template = (args) => <AppBar {...args} />;

export const Default = Template.bind({});

export const WithTitle = Template.bind({});
WithTitle.args = { title: 'Page Title' };

export const WithNavAction = Template.bind({});
WithNavAction.args = {
  ...WithTitle.args,
  navActionProps: {
    'aria-label': 'open nav drawer',
    children: <MenuIcon />,
    onClick: action('open nav drawer'),
  },
};

export const WithSingleAction = Template.bind({});
WithSingleAction.args = {
  ...WithNavAction.args,
  actionProps: {
    'aria-label': 'open account menu',
    children: <AccountCircleIcon />,
    onClick: action('open account menu'),
  },
};

export const WithActions = Template.bind({});
WithActions.args = {
  ...WithNavAction.args,
  actionProps: [
    {
      'aria-label': 'create',
      children: <AddIcon />,
      onClick: action('create'),
    },
    {
      'aria-label': 'edit',
      children: <EditIcon />,
      onClick: action('edit'),
    },
    {
      'aria-label': 'open account menu',
      children: <AccountCircleIcon />,
      onClick: action('open account menu'),
    },
  ],
};
