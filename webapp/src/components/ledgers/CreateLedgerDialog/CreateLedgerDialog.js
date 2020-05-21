import React from 'react';

import LedgerDialogForm from '../LedgerDialogForm';
import { useCreateLedger } from './useCreateLedger';

const initialValues = {
  name: '',
  currency: 840, // USD
};

const CreateLedgerDialog = () => {
  const { dialogOpen, handleCloseDialog, handleCreate } = useCreateLedger();
  return (
    <LedgerDialogForm
      actionText='Create'
      initialValues={initialValues}
      onClose={handleCloseDialog}
      onSubmit={handleCreate}
      open={dialogOpen}
      title='Create Ledger'
    />
  );
};

export default CreateLedgerDialog;
