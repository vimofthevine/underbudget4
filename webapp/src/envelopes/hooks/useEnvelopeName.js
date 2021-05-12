import React from 'react';

import useEnvelopes from './useEnvelopes';

export default () => {
  const { categories = [] } = useEnvelopes({ sorted: false });
  return React.useCallback(
    (id) => {
      for (let i = 0; i < categories.length; i += 1) {
        const category = categories[i];
        for (let j = 0; j < category.envelopes.length; j += 1) {
          if (category.envelopes[j].id === id) {
            return `${category.name}:${category.envelopes[j].name}`;
          }
        }
      }
      return 'unknown';
    },
    [categories],
  );
};
