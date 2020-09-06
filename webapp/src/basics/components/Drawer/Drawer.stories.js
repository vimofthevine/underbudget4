import { action } from '@storybook/addon-actions';
import React from 'react';

import Drawer from './Drawer';

export default {
  title: 'basics/Drawer',
  component: Drawer,
};

const Template = (args) => <Drawer {...args} />;

export const Permanent = Template.bind({});
Permanent.args = {
  children: <span>Nav</span>,
  onClose: action('close drawer'),
  open: true,
  variant: 'permanent',
};

export const Temporary = Template.bind({});
Temporary.args = { ...Permanent.args, variant: 'temporary' };
