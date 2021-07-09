import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { action } from '@storybook/addon-actions';
import React from 'react';

import PureDrawer from './PureDrawer';

export default {
  title: 'common/PureDrawer',
  component: PureDrawer,
};

const Template = (args) => (
  <PureDrawer {...args}>
    <List>
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' />
      </ListItem>
    </List>
  </PureDrawer>
);

export const PermanentClosed = Template.bind({});
PermanentClosed.args = {
  onClose: action('close drawer'),
  onOpen: action('open drawer'),
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
