import AddIcon from '@material-ui/icons/Add';
import { action } from '@storybook/addon-actions';
import React from 'react';

import Fab from './Fab';

export default {
  title: 'common/Fab',
  component: Fab,
};

export const PrimaryColor = () => (
  <Fab onClick={action('click')}>
    <AddIcon />
  </Fab>
);

export const SecondaryColor = () => (
  <Fab color='secondary' onClick={action('click')}>
    <AddIcon />
  </Fab>
);
