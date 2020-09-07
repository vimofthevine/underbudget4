import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import useSelection from '../../hooks/useSelection';
import AppProviders from '../AppProviders';
import FullAppBar from './FullAppBar';

export default {
  title: 'common/FullAppBar',
  component: FullAppBar,
  decorators: [
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
    (story) => <AppProviders>{story()}</AppProviders>,
  ],
};

const Template = (args) => <FullAppBar {...args} />;

export const Default = Template.bind({});

export const WithActions = Template.bind({});
WithActions.args = {
  primaryActions: [
    {
      'aria-label': 'create',
      icon: <AddIcon />,
      onClick: action('create'),
      text: 'Create item',
    },
    {
      'aria-label': 'edit',
      icon: <EditIcon />,
      onClick: action('edit'),
      text: 'Edit item',
    },
    {
      'aria-label': 'delete',
      icon: <DeleteIcon />,
      onClick: action('delete'),
      text: 'Delete item',
    },
  ],
};

export const MobileWithOverflowActions = Template.bind({});
MobileWithOverflowActions.args = WithActions.args;
MobileWithOverflowActions.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};

export const MobileWithTwoActions = Template.bind({});
MobileWithTwoActions.args = {
  primaryActions: [
    {
      'aria-label': 'create',
      icon: <AddIcon />,
      onClick: action('create'),
      text: 'Create item',
    },
    {
      'aria-label': 'delete',
      icon: <DeleteIcon />,
      onClick: action('delete'),
      text: 'Delete item',
    },
  ],
};
MobileWithTwoActions.parameters = MobileWithOverflowActions.parameters;

const SelectButtons = () => {
  const [item, setItem] = React.useState(0);
  const { select, unselect } = useSelection();
  const handleSelect = () => {
    select(item);
    setItem((old) => old + 1);
  };
  const handleUnselect = () => {
    unselect(item - 1);
    setItem((old) => old - 1);
  };

  return (
    <>
      <Button onClick={handleSelect}>Select</Button>
      <Button disabled={item === 0} onClick={handleUnselect}>
        Unselect
      </Button>
    </>
  );
};

export const WithSelection = (args) => (
  <>
    <FullAppBar {...args} />
    <SelectButtons />
  </>
);
WithSelection.args = {
  primaryActions: [
    {
      'aria-label': 'Create item',
      icon: <AddIcon />,
      onClick: action('add item'),
      text: 'Add item',
    },
  ],
  selectionActions: [
    {
      'aria-label': 'Edit selected',
      icon: <EditIcon />,
      onClick: action('edit selected'),
      text: 'Edit selected',
    },
    {
      'aria-label': 'Delete selected',
      icon: <DeleteIcon />,
      onClick: action('delete selected'),
      text: 'Delete selected',
    },
  ],
};
