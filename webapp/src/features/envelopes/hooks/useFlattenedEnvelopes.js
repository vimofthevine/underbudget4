import React from 'react';

import useEnvelopes from './useEnvelopes';

export default function useFlattenedEnvelopes() {
  const { categories } = useEnvelopes({ sorted: true });
  return React.useMemo(() => {
    const envelopes = [];
    for (let i = 0; i < categories.length; i += 1) {
      for (let j = 0; j < categories[i].envelopes.length; j += 1) {
        envelopes.push({
          id: categories[i].envelopes[j].id,
          name: `${categories[i].name}:${categories[i].envelopes[j].name}`,
        });
      }
    }
    return envelopes;
  }, [categories]);
}
