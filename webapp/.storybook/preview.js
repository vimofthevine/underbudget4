import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { addDecorator } from '@storybook/react';

addDecorator(story => (
  <>
    <CssBaseline />
    {story()}
  </>
));