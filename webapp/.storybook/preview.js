import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { addDecorator } from '@storybook/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createMemoryHistory } from 'history';
import { useDarkMode } from 'storybook-dark-mode';

import MemoryRouter from '../src/common/components/MemoryRouter';
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
  const history = createMemoryHistory({ initialEntries: [initialRoute] });
  React.useEffect(() => history.listen((location) => action('navigate')(location)), [history]);

  return (
    <ThemeProvider theme={createTheme(useDarkMode())}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <MemoryRouter history={history}>{story()}</MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
});

addDecorator(withA11y);

export const parameters = {
  layout: 'fullscreen',
};
