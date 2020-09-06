import React from 'react';

import { WithActions as AppBar } from '../AppBar/AppBar.stories';
import AppPage from './AppPage';

export default {
  title: 'basics/AppPage',
  component: AppPage,
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

const Template = (args) => <AppPage {...args} />;

export const Default = Template.bind({});
Default.args = { children: <Wrapper>hi</Wrapper> };

export const WithAppBar = Template.bind({});
WithAppBar.args = { ...Default.args, appBar: <AppBar /> };

export const WithTallContent = Template.bind({});
WithTallContent.args = {
  ...WithAppBar.args,
  children: (
    <Wrapper>
      {[...new Array(30)].map((v, i) => (
        <p key={i}>Paragraph #{i}</p>
      ))}
    </Wrapper>
  ),
};

export const WithFab = Template.bind({});
WithFab.args = { ...WithTallContent.args, hasFab: true };
