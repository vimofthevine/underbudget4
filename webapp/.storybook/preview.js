import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { withA11y } from '@storybook/addon-a11y';
import { addDecorator } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useDarkMode } from 'storybook-dark-mode';

import createTheme from '../src/common/utils/createTheme';

addDecorator((story, { parameters }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const { initialRoute = '/' } = parameters;

  return (
    <ThemeProvider theme={createTheme(useDarkMode())}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          {story()}
        </MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
});

addDecorator(withA11y);

export const parameters = {
  layout: 'fullscreen',
};
