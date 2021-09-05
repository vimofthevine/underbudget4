import AddCircleIcon from '@material-ui/icons/AddCircle';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import FullAppPage from 'common/components/FullAppPage';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import CreateEnvelopeCategoryDialog from '../components/CreateEnvelopeCategoryDialog';
import CreateEnvelopeDialog from '../components/CreateEnvelopeDialog';
import EnvelopesList from '../components/EnvelopesList';
import ModifyEnvelopeCategoryDialog from '../components/ModifyEnvelopeCategoryDialog';

const EnvelopesListPage = () => {
  const navigate = useNavigateKeepingSearch();

  const actions = [
    {
      'aria-label': 'Create envelope',
      icon: <AddCircleIcon />,
      onClick: () => navigate('create'),
      text: 'Create envelope',
    },
    {
      'aria-label': 'Create envelope category',
      icon: <CreateNewFolderIcon />,
      onClick: () => navigate('create-category'),
      text: 'Create category',
    },
  ];

  return (
    <FullAppPage primaryActions={actions} title='Envelopes'>
      <EnvelopesList />
      <Routes>
        <Route path='create-category' element={<CreateEnvelopeCategoryDialog />} />
        <Route path='modify-category/:id' element={<ModifyEnvelopeCategoryDialog />} />
        <Route path='create' element={<CreateEnvelopeDialog />} />
      </Routes>
    </FullAppPage>
  );
};

export default EnvelopesListPage;
