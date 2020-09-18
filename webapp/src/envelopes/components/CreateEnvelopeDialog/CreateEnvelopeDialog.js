import React from 'react';

import EnvelopeDialogForm from '../EnvelopeDialogForm';
import useCreateEnvelopeDialog from './useCreateEnvelopeDialog';

const initialValues = {
  name: '',
  category: '',
};

const CreateEnvelopeDialog = () => {
  const { dialogOpen, handleCloseDialog, handleCreate } = useCreateEnvelopeDialog();
  return (
    <EnvelopeDialogForm
      actionText='Create'
      initialValues={initialValues}
      onClose={handleCloseDialog}
      onSubmit={handleCreate}
      open={dialogOpen}
      title='Create Envelope'
    />
  );
};

export default CreateEnvelopeDialog;
