import React from 'react';

const key = 'underbudget.drawer.open';
const setDrawerState = (open) => localStorage.setItem(key, String(open));
const getDrawerState = () => localStorage.getItem(key) === 'true';

export default function useDrawerState() {
  const [open, setOpen] = React.useState(getDrawerState);
  const handleToggle = () => {
    setDrawerState(!open);
    setOpen(!open);
  };
  return [open, handleToggle];
}
