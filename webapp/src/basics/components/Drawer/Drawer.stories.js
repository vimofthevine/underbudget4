import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { action } from '@storybook/addon-actions';
import React from 'react';

import Drawer from './Drawer';

export default {
  title: 'basics/Drawer',
  component: Drawer,
};

const Template = (args) => (
  <Drawer {...args}>
    <List>
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' />
      </ListItem>
    </List>
  </Drawer>
);

export const PermanentClosed = Template.bind({});
PermanentClosed.args = {
  onClose: action('close drawer'),
  open: false,
  variant: 'permanent',
};

export const PermanentOpened = Template.bind({});
PermanentOpened.args = {
  ...PermanentClosed.args,
  open: true,
};

export const TemporaryClosed = Template.bind({});
TemporaryClosed.args = { ...PermanentClosed.args, variant: 'temporary' };

export const TemporaryOpened = Template.bind({});
TemporaryOpened.args = { ...PermanentOpened.args, variant: 'temporary' };
