import { action } from '@storybook/addon-actions';
import React from 'react';

import MoreActionsButton from './MoreActionsButton';

export default {
  title: 'common/MoreActionsButton',
  component: MoreActionsButton,
};

const Template = (args) => <MoreActionsButton {...args} />;
