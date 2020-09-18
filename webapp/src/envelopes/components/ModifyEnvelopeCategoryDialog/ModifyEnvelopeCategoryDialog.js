import React from 'react';

import EnvelopeCategoryDialogForm from '../EnvelopeCategoryDialogForm';
import useModifyEnvelopeCategoryDialog from './useModifyEnvelopeCategoryDialog';

const ModifyEnvelopeCategoryDialog = () => {
  const {
    category,
    dialogOpen,
    handleCloseDialog,
    handleModify,
  } = useModifyEnvelopeCategoryDialog();
  return (
    <EnvelopeCategoryDialogForm
      actionText='Save'
      initialValues={category}
      onClose={handleCloseDialog}
      onSubmit={handleModify}
      open={dialogOpen}
      title='Modify Category'
    />
  );
};

export default ModifyEnvelopeCategoryDialog;
