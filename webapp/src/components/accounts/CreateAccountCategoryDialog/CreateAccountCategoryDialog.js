import React from 'react';

import AccountCategoryDialogForm from '../AccountCategoryDialogForm';
import { useCreateAccountCategory } from './useCreateAccountCategory';

const initialValues = {
  name: '',
};

const CreateAccountCategoryDialog = () => {
  const { dialogOpen, handleCloseDialog, handleCreate } = useCreateAccountCategory();
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
