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
  children: 'content',
};

export const Mobile = Template.bind({});
Mobile.args = Desktop.args;
Mobile.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};
