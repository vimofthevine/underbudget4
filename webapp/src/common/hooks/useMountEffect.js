import React from 'react';

export default function useMountEffect(effect) {
  React.useEffect(effect, []);
}
