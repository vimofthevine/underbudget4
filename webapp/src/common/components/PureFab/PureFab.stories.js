import AddIcon from '@material-ui/icons/Add';
import { action } from '@storybook/addon-actions';
import React from 'react';

import PureFab from './PureFab';

export default {
  title: 'common/PureFab',
  component: PureFab,
};

const Template = (args) => <PureFab {...args} />;

export const PrimaryColor = Template.bind({});
PrimaryColor.args = {
  action: {
    'aria-label': 'add item',
    icon: <AddIcon />,
    onClick: action('click'),
    text: 'Add item',
  },
};

export const SecondaryColor = Template.bind({});
SecondaryColor.args = {
  ...PrimaryColor.args,
  color: 'secondary',
};
