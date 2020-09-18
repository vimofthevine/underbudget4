import AddCircleIcon from '@material-ui/icons/AddCircle';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import React from 'react';

import FullAppPage from '../../../common/components/FullAppPage';
import useCreateEnvelope from '../../hooks/useCreateEnvelope';
import useCreateEnvelopeCategory from '../../hooks/useCreateEnvelopeCategory';
import CreateEnvelopeCategoryDialog from '../CreateEnvelopeCategoryDialog';
import CreateEnvelopeDialog from '../CreateEnvelopeDialog';
import EnvelopesList from '../EnvelopesList';
import ModifyEnvelopeCategoryDialog from '../ModifyEnvelopeCategoryDialog';

const EnvelopesListPage = () => {
  const actions = [
    {
      'aria-label': 'Create envelope',
      icon: <AddCircleIcon />,
      onClick: useCreateEnvelope(),
      text: 'Create envelope',
    },
    {
      'aria-label': 'Create envelope category',
      icon: <CreateNewFolderIcon />,
      onClick: useCreateEnvelopeCategory(),
      text: 'Create category',
    },
  ];

  return (
    <FullAppPage primaryActions={actions} title='My Envelopes'>
      <EnvelopesList />
      <CreateEnvelopeCategoryDialog />
      <ModifyEnvelopeCategoryDialog />
      <CreateEnvelopeDialog />
    </FullAppPage>
  );
};

export default EnvelopesListPage;
