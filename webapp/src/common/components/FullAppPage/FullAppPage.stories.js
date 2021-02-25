import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';
import { action } from '@storybook/addon-actions';
import React from 'react';

import useSelection from '../../hooks/useSelection';
import AppProviders from '../AppProviders';
import { WithSelection } from '../FullAppBar/FullAppBar.stories';
import FullAppPage from './FullAppPage';

export default {
  title: 'common/FullAppPage',
  component: FullAppPage,
  decorators: [(story) => <AppProviders>{story()}</AppProviders>],
};

const SelectButtons = () => {
  const [item, setItem] = React.useState(0);
  const { select, unselect } = useSelection();
  const handleSelect = () => {
    select(item);
    setItem((old) => old + 1);
  };
  const handleUnselect = () => {
    unselect(item - 1);
    setItem((old) => old - 1);
  };

  return (
    <>
      <Button onClick={handleSelect}>Select</Button>
      <Button disabled={item === 0} onClick={handleUnselect}>
        Unselect
      </Button>
    </>
  );
};

const Template = (args) => (
  <FullAppPage {...args}>
    <SelectButtons />
  </FullAppPage>
);

export const Desktop = Template.bind({});
Desktop.args = {
  ...WithSelection.args,
  primaryActions: [
    {
      'aria-label': 'Create item',
      icon: <AddIcon />,
      onClick: action('add item'),
      text: 'Add item',
    },
    {
      'aria-label': 'Filter items',
      icon: <FilterListIcon />,
      onClick: action('filter'),
      text: 'Filter items',
    },
  ],
  useFab: true,
};

export const Mobile = Template.bind({});
Mobile.args = Desktop.args;
Mobile.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};
