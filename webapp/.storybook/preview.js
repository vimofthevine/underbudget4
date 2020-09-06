import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { withA11y } from '@storybook/addon-a11y';
import { addDecorator } from '@storybook/react';
import React from 'react';
import { useDarkMode } from 'storybook-dark-mode';

import createTheme from '../src/common/utils/createTheme';

addDecorator(story => (
  <ThemeProvider theme={createTheme(useDarkMode())}>
    <CssBaseline />
    {story()}
  </ThemeProvider>
));

addDecorator(withA11y);
