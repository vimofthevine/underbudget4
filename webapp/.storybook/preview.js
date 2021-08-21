import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { addDecorator } from '@storybook/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
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

addDecorator((story, { parameters }) => {
  const { api } = parameters;
  if (api) {
    const { delayResponse = 1000 } = api;

    const mockApi = new MockAdapter(axios, { delayResponse });

    const { delete: del = [], get = [], post = [], put = [] } = api;
    del.forEach(([url, code = 204]) => mockApi.onDelete(url).reply(code));
    get.forEach(([url, response, code = 200]) => mockApi.onGet(url).reply(code, response));
    post.forEach(([url, code = 201]) => mockApi.onPost(url).reply(code));
    put.forEach(([url, code = 200]) => mockApi.onPut(url).reply(code));
  }

  return story();
});

addDecorator(withA11y);

export const parameters = {
  layout: 'fullscreen',
};
