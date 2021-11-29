import { action } from '@storybook/addon-actions';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';

import { DrawerContextProvider } from '../../contexts/drawer';
import ActionPageAppBar from './ActionPageAppBar';
import AppBar from './AppBar';
import DrawerIconButton from './DrawerIconButton';
import NavBackIconButton from './NavBackIconButton';
import NavCloseIconButton from './NavCloseIconButton';
import RightIconButtons from './RightIconButtons';

export default {
  title: 'common/AppBar',
  component: AppBar,
  decorators: [(story) => <DrawerContextProvider>{story()}</DrawerContextProvider>],
};

const Template = (args) => <AppBar {...args} />;

export const WithDrawerIconButton = Template.bind({});
WithDrawerIconButton.args = {
  leftButton: <DrawerIconButton />,
};

export const WithNavBackIconButton = Template.bind({});
WithNavBackIconButton.args = {
  leftButton: <NavBackIconButton dest='prev-page' />,
};

export const WithNavCloseIconButton = Template.bind({});
WithNavCloseIconButton.args = {
  leftButton: <NavCloseIconButton dest='parent-page' />,
};

export const ActionPage = () => <ActionPageAppBar back='parent-page' />;

let actionCount = 0;
const createAction = (text) => {
  actionCount += 1;
  return {
    'aria-label': `Action ${text}`,
    icon: actionCount % 2 === 0 ? <AddIcon /> : <EditIcon />,
    onClick: action(text),
    text,
  };
};

export const WithOneRightIconButton = Template.bind({});
WithOneRightIconButton.args = {
  leftButton: <NavBackIconButton dest='prev-page' />,
  rightButtons: <RightIconButtons primaryActions={createAction('do one')} />,
};

export const WithOneRightIconButtonOnMobile = Template.bind({});
WithOneRightIconButtonOnMobile.args = WithOneRightIconButton.args;
WithOneRightIconButtonOnMobile.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};

export const WithTwoRightIconButtonsOnMobile = Template.bind({});
WithTwoRightIconButtonsOnMobile.args = {
  leftButton: <NavBackIconButton dest='prev-page' />,
  rightButtons: (
    <RightIconButtons primaryActions={[createAction('do first'), createAction('do second')]} />
  ),
};
WithTwoRightIconButtonsOnMobile.parameters = WithOneRightIconButtonOnMobile.parameters;

export const WithThreeRightIconButtons = Template.bind({});
WithThreeRightIconButtons.args = {
  leftButton: <NavBackIconButton dest='prev-page' />,
  rightButtons: (
    <RightIconButtons
      primaryActions={[
        createAction('do first'),
        createAction('do second'),
        createAction('do third'),
      ]}
    />
  ),
};

export const WithThreeRightIconButtonsOnMobile = Template.bind({});
WithThreeRightIconButtonsOnMobile.args = WithThreeRightIconButtons.args;
WithThreeRightIconButtonsOnMobile.parameters = WithOneRightIconButtonOnMobile.parameters;

export const WithSecondaryRightIconButtons = Template.bind({});
WithSecondaryRightIconButtons.args = {
  leftButton: <NavBackIconButton dest='prev-page' />,
  rightButtons: (
    <RightIconButtons
      primaryActions={[
        createAction('do first'),
        createAction('do second'),
        createAction('do third'),
      ]}
      secondaryActions={[createAction('do fourth'), createAction('do fifth')]}
    />
  ),
};

export const WithSecondaryRightIconButtonsOnMobile = Template.bind({});
WithSecondaryRightIconButtonsOnMobile.args = WithSecondaryRightIconButtons.args;
WithSecondaryRightIconButtonsOnMobile.parameters = WithOneRightIconButtonOnMobile.parameters;

export const WithOnePrimaryRightIconButton = Template.bind({});
WithOnePrimaryRightIconButton.args = {
  leftButton: <NavBackIconButton dest='prev-page' />,
  rightButtons: (
    <RightIconButtons
      primaryActions={[createAction('do first')]}
      secondaryActions={[createAction('do second'), createAction('do third')]}
    />
  ),
};

export const WithOnePrimaryRightIconButtonOnMobile = Template.bind({});
WithOnePrimaryRightIconButtonOnMobile.args = WithOnePrimaryRightIconButton.args;
WithOnePrimaryRightIconButtonOnMobile.parameters = WithOneRightIconButtonOnMobile.parameters;
