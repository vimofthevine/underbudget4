import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SelectAllIcon from '@material-ui/icons/SelectAll';
import { action } from '@storybook/addon-actions';
import React from 'react';

import useSelection from '../../hooks/useSelection';
import AppProviders from '../AppProviders';
import FullAppBar from './FullAppBar';

export default {
  title: 'common/FullAppBar',
  component: FullAppBar,
  decorators: [(story) => <AppProviders>{story()}</AppProviders>],
};

const Template = (args) => <FullAppBar {...args} />;

const createAction = {
  'aria-label': 'create',
  icon: <AddIcon />,
  onClick: action('create'),
  text: 'Create item',
};

const editAction = {
  'aria-label': 'edit',
  icon: <EditIcon />,
  onClick: action('edit'),
  text: 'Edit item',
};

const deleteAction = {
  'aria-label': 'delete',
  icon: <DeleteIcon />,
  onClick: action('delete'),
  text: 'Delete item',
};

const selectAction = {
  'aria-label': 'select',
  icon: <SelectAllIcon />,
  onClick: action('select'),
  text: 'Select all',
};

const mobileParameters = {
  viewport: { defaultViewport: 'mobile1' },
};

export const Default = Template.bind({});

export const OnePrimaryAction = Template.bind({});
OnePrimaryAction.args = { primaryActions: [createAction] };

export const OnePrimaryActionMobile = Template.bind({});
OnePrimaryActionMobile.args = OnePrimaryAction.args;
OnePrimaryActionMobile.parameters = mobileParameters;

export const BackNavAction = Template.bind({});
BackNavAction.args = { back: '/previous-url', primaryActions: [createAction] };

export const BackNavActionMobile = Template.bind({});
BackNavActionMobile.args = BackNavAction.args;
BackNavActionMobile.parameters = mobileParameters;

export const TwoPrimaryActions = Template.bind({});
TwoPrimaryActions.args = { primaryActions: [createAction, editAction] };

export const TwoPrimaryActionsMobile = Template.bind({});
TwoPrimaryActionsMobile.args = TwoPrimaryActions.args;
TwoPrimaryActionsMobile.parameters = mobileParameters;

export const ThreePrimaryActions = Template.bind({});
ThreePrimaryActions.args = { primaryActions: [createAction, editAction, deleteAction] };

export const ThreePrimaryActionsMobile = Template.bind({});
ThreePrimaryActionsMobile.args = ThreePrimaryActions.args;
ThreePrimaryActionsMobile.parameters = mobileParameters;

export const OnePrimaryAndSecondaryActions = Template.bind({});
OnePrimaryAndSecondaryActions.args = {
  primaryActions: [createAction],
  secondaryActions: [selectAction],
};

export const OnePrimaryAndSecondaryActionsMobile = Template.bind({});
OnePrimaryAndSecondaryActionsMobile.args = OnePrimaryAndSecondaryActions.args;
OnePrimaryAndSecondaryActionsMobile.parameters = mobileParameters;

export const TwoPrimaryAndSecondaryActions = Template.bind({});
TwoPrimaryAndSecondaryActions.args = {
  primaryActions: [createAction, editAction],
  secondaryActions: [selectAction],
};

export const TwoPrimaryAndSecondaryActionsMobile = Template.bind({});
TwoPrimaryAndSecondaryActionsMobile.args = TwoPrimaryAndSecondaryActions.args;
TwoPrimaryAndSecondaryActionsMobile.parameters = mobileParameters;

export const ThreePrimaryAndSecondaryActions = Template.bind({});
ThreePrimaryAndSecondaryActions.args = {
  primaryActions: [createAction, editAction, deleteAction],
  secondaryActions: [selectAction],
};

export const ThreePrimaryAndSecondaryActionsMobile = Template.bind({});
ThreePrimaryAndSecondaryActionsMobile.args = ThreePrimaryAndSecondaryActions.args;
ThreePrimaryAndSecondaryActionsMobile.parameters = mobileParameters;

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

export const TwoSelectionActions = (args) => (
  <>
    <FullAppBar {...args} />
    <SelectButtons />
  </>
);
TwoSelectionActions.args = {
  primaryActions: [createAction],
  secondaryActions: [editAction],
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

export const ThreeSelectionActions = TwoSelectionActions.bind({});
ThreeSelectionActions.args = {
  primaryActions: [createAction],
  secondaryActions: [editAction],
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
    {
      'aria-label': 'Select selected',
      icon: <SelectAllIcon />,
      onClick: action('select selected'),
      text: 'Select selected',
    },
  ],
};
