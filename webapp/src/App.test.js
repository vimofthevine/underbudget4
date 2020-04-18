import { render } from '@testing-library/react';
import mediaQuery from 'css-mediaquery';
import React from 'react';

import App from './App';

describe('App', () => {
  it('should prompt to log in', () => {
    const { getByText } = render(<App />);
    expect(getByText(/log in/i)).toBeInTheDocument();
  });

  it('should render with dark mode preference', () => {
    window.matchMedia = (query) => ({
      matches: mediaQuery.match(query, { 'prefers-color-scheme': 'dark' }),
      addListener: () => 0,
      removeListener: () => 0,
    });
    // Dark mode doesn't add any named classes, so not sure how to verify...
    render(<App />);
  });
});
