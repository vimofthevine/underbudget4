import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { action } from '@storybook/addon-actions';
import React from 'react';

import PureActionMenu from './PureActionMenu';

export default {
  title: 'common/PureActionMenu',
  component: PureActionMenu,
};

const Template = (args) => {
  const [anchor, setAnchor] = React.useState(null);
  const handleOpen = (e) => setAnchor(e.currentTarget);
  const handleClose = () => setAnchor(null);
  return (
    <>
      <Button onClick={handleOpen}>Open</Button>
      <PureActionMenu anchor={anchor} onClose={handleClose} {...args} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  actions: [
    {
      'aria-label': 'add item',
      icon: <AddIcon />,
      onClick: action('add'),
      text: 'Add Item',
    },
    {
      'aria-label': 'remove item',
      icon: <RemoveIcon />,
      onClick: action('remove'),
      text: 'Remove Item',
    },
  ],
};
