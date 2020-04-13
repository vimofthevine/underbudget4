import { action } from '@storybook/addon-actions';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import NavDrawer from './NavDrawer';

export default {
  title: 'common/NavDrawer',
  component: NavDrawer,
  decorators: [(story) => <MemoryRouter>{story()}</MemoryRouter>],
};

export const Open = () => <NavDrawer onClose={action('close')} open />;

export const Closed = () => <NavDrawer onClose={action('close')} open={false} />;
