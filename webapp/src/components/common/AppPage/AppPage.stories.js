import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import AppProviders from '../../../common/components/AppProviders';
import useConfirmation from '../../../common/hooks/useConfirmation';
import useSnackbar from '../../../common/hooks/useSnackbar';
import AppPage from './AppPage';

export default {
  title: 'common/AppPage',
  component: AppPage,
  decorators: [
    (story) => <AppProviders>{story()}</AppProviders>,
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
  ],
};

export const DefaultTitle = () => (
  <AppPage>
    <div style={{ background: 'lightgreen' }}>Hello World</div>
  </AppPage>
);

export const WithTitle = () => (
  <AppPage title='Hello Page'>
    <p>Hello World</p>
  </AppPage>
);

const ConfirmButton = () => {
  const confirm = useConfirmation();
  const handleClick = () =>
    confirm({ catch: true, message: 'Button was clicked!' })
      .then(() => {
        alert('we got confirmation!');
      })
      .catch(() => {
        alert('we got rejection!');
      });
  return <Button onClick={handleClick}>Click me!</Button>;
};

export const ConfirmationDialog = () => (
  <AppPage>
    <ConfirmButton />
  </AppPage>
);

const SnackbarButton = () => {
  const snackbar = useSnackbar();
  const handleClick = () => snackbar('You hit the button!');
  return <Button onClick={handleClick}>Click me!</Button>;
};

export const SnackbarMessage = () => (
  <AppPage>
    <SnackbarButton />
  </AppPage>
);

const ActionButton = () => (
  <IconButton color='inherit' edge='end' onClick={action('onActionClick')}>
    <MoreVertIcon />
  </IconButton>
);

export const ToolbarActionButton = () => <AppPage toolbarAction={<ActionButton />} />;
