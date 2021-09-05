import React from 'react';

import useAccounts from './useAccounts';

export default function useFlattenedAccounts() {
  const { categories } = useAccounts({ sorted: true });
  return React.useMemo(() => {
    const accounts = [];
    for (let i = 0; i < categories.length; i += 1) {
      for (let j = 0; j < categories[i].accounts.length; j += 1) {
        accounts.push({
          id: categories[i].accounts[j].id,
          name: `${categories[i].name}:${categories[i].accounts[j].name}`,
        });
      }
    }
    return accounts;
  }, [categories]);
}
