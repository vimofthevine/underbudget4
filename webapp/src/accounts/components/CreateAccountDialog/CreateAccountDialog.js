import React from 'react';

import AccountDialogForm from '../AccountDialogForm';
import useCreateAccountDialog from './useCreateAccountDialog';

const initialValues = {
  name: '',
  category: '',
  institution: '',
  accountNumber: '',
};

const CreateAccountDialog = () => {
  const { dialogOpen, handleCloseDialog, handleCreate } = useCreateAccountDialog();
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
