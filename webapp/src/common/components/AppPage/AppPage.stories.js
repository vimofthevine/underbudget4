import * as faker from 'faker';
import React from 'react';

import { DrawerContextProvider } from '../../contexts/drawer';
import { TopLevelPageAppBar } from '../AppBar';
import AppPage from './AppPage';

export default {
  title: 'common/AppPage',
  component: AppPage,
  decorators: [(story) => <DrawerContextProvider>{story()}</DrawerContextProvider>],
};

const Template = (args) => <AppPage {...args} />;

export const Desktop = Template.bind({});
Desktop.args = {
  appBar: <TopLevelPageAppBar />,
  children: faker.lorem.paragraphs(100),
};

export const Mobile = Template.bind({});
Mobile.args = Desktop.args;
Mobile.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};

export const ProminentAppBar = Template.bind({});
ProminentAppBar.args = {
  appBar: <TopLevelPageAppBar prominent />,
  children: faker.lorem.paragraphs(100),
  prominent: true,
};
ProminentAppBar.parameters = Mobile.parameters;
