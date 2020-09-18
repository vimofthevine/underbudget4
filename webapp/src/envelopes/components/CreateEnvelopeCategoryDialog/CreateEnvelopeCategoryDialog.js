import React from 'react';

import EnvelopeCategoryDialogForm from '../EnvelopeCategoryDialogForm';
import useCreateEnvelopeCategoryDialog from './useCreateEnvelopeCategoryDialog';

const initialValues = {
  name: '',
};

const CreateEnvelopeCategoryDialog = () => {
  const { dialogOpen, handleCloseDialog, handleCreate } = useCreateEnvelopeCategoryDialog();
  return (
    <EnvelopeCategoryDialogForm
      actionText='Create'
      initialValues={initialValues}
      onClose={handleCloseDialog}
      onSubmit={handleCreate}
      open={dialogOpen}
      title='Create Category'
    />
  );
};

export default CreateEnvelopeCategoryDialog;
