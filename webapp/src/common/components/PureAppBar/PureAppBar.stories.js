import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import MenuIcon from '@material-ui/icons/Menu';
import { action } from '@storybook/addon-actions';
import React from 'react';

import PureAppBar from './PureAppBar';

export default {
  title: 'common/PureAppBar',
  component: PureAppBar,
};

const Template = (args) => <PureAppBar {...args} />;

export const Default = Template.bind({});

export const WithTitle = Template.bind({});
WithTitle.args = { title: 'Page Title' };

export const WithNavAction = Template.bind({});
WithNavAction.args = {
  ...WithTitle.args,
  navAction: {
    'aria-label': 'open nav drawer',
    icon: <MenuIcon />,
    onClick: action('open nav drawer'),
    text: 'Nav drawer',
  },
};

export const WithSingleAction = Template.bind({});
WithSingleAction.args = {
  ...WithNavAction.args,
  actions: {
    'aria-label': 'open account menu',
    icon: <AccountCircleIcon />,
    onClick: action('open account menu'),
    text: 'Account actions',
  },
};

export const WithActions = Template.bind({});
WithActions.args = {
  ...WithNavAction.args,
  actions: [
    {
      'aria-label': 'create',
      icon: <AddIcon />,
      onClick: action('create'),
      text: 'Create',
    },
    {
      'aria-label': 'edit',
      icon: <EditIcon />,
      onClick: action('edit'),
      text: 'Edit',
    },
    {
      'aria-label': 'open account menu',
      icon: <AccountCircleIcon />,
      onClick: action('open account menu'),
      text: 'Account actions',
    },
  ],
};
