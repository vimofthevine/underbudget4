// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import { configure, getConfig } from '@testing-library/react';
import { setLogger } from 'react-query';

setLogger({
  log: () => 0,
  warn: () => 0,
  error: () => 0,
});

const origGetElementError = getConfig().getElementError;
function getElementError(message, container) {
  // Even though this should only ever be the document.body or a specific container,
  // when we use the Material-UI Autocomplete component this gets reset to the top-level
  // document, which results in a huge prettyDOM printout that includes all the injected
  // MUI JSS in the document head that is not useful for test debugging. So we set it
  // back to document.body if that occurs.
  if (container === document) {
    container = document.body;
  }
  const error = origGetElementError(message, container);
  // This resets the stack trace to omit this function, otherwise jest reports the error as
  // occuring here
  Error.captureStackTrace(error, getElementError);
  return error;
}
configure({ getElementError });
