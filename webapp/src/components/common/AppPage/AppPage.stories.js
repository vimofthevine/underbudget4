import Button from '@material-ui/core/Button';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { useConfirmation } from '../ConfirmationService';
import AppPage from './AppPage';

export default {
  title: 'common/AppPage',
  component: AppPage,
  decorators: [(story) => <MemoryRouter>{story()}</MemoryRouter>],
};

export const DefaultTitle = () => (
  <AppPage>
    <div style={{ background: 'lightgreen' }}>Hello World</div>
  </AppPage>
);

export const WithTitle = () => (
  <AppPage title='Hello Page'>
    <p>Hello World</p>
  </AppPage>
);

const ConfirmButton = () => {
  const confirm = useConfirmation();
  const handleClick = () =>
    confirm({ catch: true, message: 'Button was clicked!' })
      .then(() => {
        alert('we got confirmation!');
      })
      .catch(() => {
        alert('we got rejection!');
      });
  return <Button onClick={handleClick}>Click me!</Button>;
};

export const ConfirmationDialog = () => (
  <AppPage>
    <ConfirmButton />
  </AppPage>
);
