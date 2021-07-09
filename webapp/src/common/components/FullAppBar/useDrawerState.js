import React from 'react';

import useMobile from '../../hooks/useMobile';

const key = 'underbudget.drawer.open';
const setDrawerState = (open) => localStorage.setItem(key, String(open));
const getDrawerState = () => localStorage.getItem(key) === 'true';

export default function useDrawerState() {
  const mobile = useMobile();
  const [open, setOpen] = React.useState(mobile ? false : getDrawerState);
  const handleToggle = () => {
    if (!mobile) {
      setDrawerState(!open);
    }
    setOpen(!open);
  };
  return [open, handleToggle];
}
