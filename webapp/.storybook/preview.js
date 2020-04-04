import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { addDecorator } from '@storybook/react';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[100],
    },
    secondary: {
      main: indigo[100],
    },
  },
});

addDecorator(story => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {story()}
  </ThemeProvider>
));