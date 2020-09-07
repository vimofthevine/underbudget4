import React from 'react';

import AppBar from '../PureAppBar';
import { WithActions } from '../PureAppBar/PureAppBar.stories';
import Drawer from '../PureDrawer';
import { PermanentOpened, TemporaryOpened } from '../PureDrawer/PureDrawer.stories';
import PureAppPage from './PureAppPage';

export default {
  title: 'common/PureAppPage',
  component: PureAppPage,
};

const Wrapper = ({ children }) => (
  <div
    style={{
      border: '1px solid red',
      margin: 0,
      padding: 0,
    }}
  >
    {children}
  </div>
);

const Template = (args) => <PureAppPage {...args} />;

export const Default = Template.bind({});
Default.args = { children: <Wrapper>hi</Wrapper> };

export const WithAppBar = Template.bind({});
WithAppBar.args = { ...Default.args, appBar: <AppBar {...WithActions.args} /> };

export const WithTallContent = Template.bind({});
WithTallContent.args = {
  ...WithAppBar.args,
  children: (
    <Wrapper>
      {[...new Array(30)].map((v, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <p key={i}>Paragraph #{i}</p>
      ))}
    </Wrapper>
  ),
};

export const WithFab = Template.bind({});
WithFab.args = { ...WithTallContent.args, hasFab: true };

export const WithPermanentDrawer = Template.bind({});
WithPermanentDrawer.args = {
  ...WithTallContent.args,
  appBar: (
    <>
      <AppBar {...WithActions.args} />
      <Drawer {...PermanentOpened.args} />
    </>
  ),
};

export const WithTemporaryDrawer = Template.bind({});
WithTemporaryDrawer.args = {
  ...WithTallContent.args,
  appBar: (
    <>
      <AppBar {...WithActions.args} />
      <Drawer {...TemporaryOpened.args} />
    </>
  ),
};

export const Mobile = Template.bind({});
Mobile.args = WithTallContent.args;
Mobile.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};

export const MobileWithDrawer = Template.bind({});
MobileWithDrawer.args = WithTemporaryDrawer.args;
MobileWithDrawer.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};
