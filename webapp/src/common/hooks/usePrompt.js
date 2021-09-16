import React from 'react';
import { useBlocker } from 'react-router-dom';

export default (message, when) => {
  const blocker = React.useCallback(
    (tx) => {
      const result = typeof message === 'string' ? message : message(tx);
      if (typeof result === 'string') {
        // eslint-disable-next-line no-alert
        if (window.confirm(result)) {
          tx.retry();
        }
      } else {
        tx.retry();
      }
    },
    [message],
  );

  useBlocker(blocker, when);
};
