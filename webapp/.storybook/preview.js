import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { addDecorator } from '@storybook/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useDarkMode } from 'storybook-dark-mode';

import useMemoryRouter from '../src/common/hooks/useMemoryRouter';
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
  const { history, routerProps, Router } = useMemoryRouter({ initialEntries: [initialRoute] });
  React.useEffect(() => history.listen((location) => action('navigate')(location)), [history]);

  return (
    <ThemeProvider theme={createTheme(useDarkMode())}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Router {...routerProps}>{story()}</Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
});

addDecorator(withA11y);

export const parameters = {
  layout: 'fullscreen',
};
