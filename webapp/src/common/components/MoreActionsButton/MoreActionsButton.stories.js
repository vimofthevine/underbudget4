import { action } from '@storybook/addon-actions';
import React from 'react';

import MoreActionsButton from './MoreActionsButton';

export default {
  title: 'common/MoreActionsButton',
  component: MoreActionsButton,
};

const Template = (args) => <MoreActionsButton {...args} />;

export const TwoActions = Template.bind({});
TwoActions.args = {
  actions: [
    {
      'aria-label': 'action 1',
      icon: null,
      onClick: action('action1'),
      text: 'Action 1',
    },
    {
      'aria-label': 'action 2',
      icon: null,
      onClick: action('action2'),
      text: 'Action 2',
    },
  ],
};
