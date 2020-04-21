import { actions } from '@storybook/addon-actions';
import React from 'react';

import ConfirmationDialog from './ConfirmationDialog';

const dialogActions = actions('onConfirm', 'onReject');

export default {
  title: 'common/ConfirmationDialog',
  component: ConfirmationDialog,
};

export const DefaultProperties = () => <ConfirmationDialog open />;

export const Customized = () => (
  <ConfirmationDialog
    confirmText='Do it'
    message='Are you 100% positive this is what you want?'
    open
    rejectText='Nevermind'
    title='Confirm it!'
    {...dialogActions}
  />
);
