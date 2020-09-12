import React from 'react';

import AccountCategoryDialogForm from '../AccountCategoryDialogForm';
import useCreateAccountCategoryDialog from './useCreateAccountCategoryDialog';

const initialValues = {
  name: '',
};

const CreateAccountCategoryDialog = () => {
  const { dialogOpen, handleCloseDialog, handleCreate } = useCreateAccountCategoryDialog();
  return (
    <AccountCategoryDialogForm
      actionText='Create'
      initialValues={initialValues}
      onClose={handleCloseDialog}
      onSubmit={handleCreate}
      open={dialogOpen}
      title='Create Category'
    />
  );
};

export default CreateAccountCategoryDialog;
