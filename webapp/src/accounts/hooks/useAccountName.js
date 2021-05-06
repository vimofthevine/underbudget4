import React from 'react';

import useAccounts from './useAccounts';

export default () => {
  const { categories } = useAccounts({ sorted: false });
  return React.useCallback(
    (id) => {
      for (let i = 0; i < categories.length; i += 1) {
        const category = categories[i];
        for (let j = 0; j < category.accounts.length; j += 1) {
          if (category.accounts[j].id === id) {
            return `${category.name}:${category.accounts[j].name}`;
          }
        }
      }
      return 'unknown';
    },
    [categories],
  );
};
