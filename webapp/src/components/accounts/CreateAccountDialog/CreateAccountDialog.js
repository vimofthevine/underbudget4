import React from 'react';

import AccountDialogForm from '../AccountDialogForm';
import { useCreateAccount } from './useCreateAccount';

const initialValues = {
  name: '',
  category: '',
  institution: '',
  accountNumber: '',
};

const CreateAccountDialog = () => {
  const { dialogOpen, handleCloseDialog, handleCreate } = useCreateAccount();
  return (
    <AccountDialogForm
      actionText='Create'
      initialValues={initialValues}
      onClose={handleCloseDialog}
      onSubmit={handleCreate}
      open={dialogOpen}
      title='Create Account'
    />
  );
};

export default CreateAccountDialog;
