import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import useConfirmation from '../../hooks/useConfirmation';
import useSelection from '../../hooks/useSelection';
import useSnackbar from '../../hooks/useSnackbar';
import AppProviders from '../AppProviders';
import AppPage from './AppPage';

export default {
  title: 'common/AppPage',
  component: AppPage,
  decorators: [
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
    (story) => <AppProviders>{story()}</AppProviders>,
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

const SelectButtons = () => {
  const { selected, select, unselect } = useSelection();
  return (
    <>
      <Button onClick={() => select(selected.length)}>Select</Button>
      <Button disabled={selected.length === 0} onClick={() => unselect(selected.length - 1)}>
        Unselect
      </Button>
    </>
  );
};

export const SelectionActions = () => (
  <AppPage
    appBarProps={{
      selectionActions: <ActionButton />,
    }}
  >
    <SelectButtons />
  </AppPage>
);
