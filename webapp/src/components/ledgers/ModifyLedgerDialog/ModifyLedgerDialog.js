import React from 'react';

import LedgerDialogForm from '../LedgerDialogForm';
import { useModifyLedger } from './useModifyLedger';

const ModifyLedgerDialog = () => {
  const { dialogOpen, handleCloseDialog, handleModify, ledger } = useModifyLedger();
  return (
    <LedgerDialogForm
      actionText='Save'
      initialValues={ledger}
      onClose={handleCloseDialog}
      onSubmit={handleModify}
      open={dialogOpen}
      title='Modify Ledger'
    />
  );
};

export default ModifyLedgerDialog;
