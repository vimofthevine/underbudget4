import React from 'react';

import AccountCategoryDialogForm from '../AccountCategoryDialogForm';
import useModifyAccountCategoryDialog from './useModifyAccountCategoryDialog';

const ModifyAccountCategoryDialog = () => {
  const {
    category,
    dialogOpen,
    handleCloseDialog,
    handleModify,
  } = useModifyAccountCategoryDialog();
  return (
    <AccountCategoryDialogForm
      actionText='Save'
      initialValues={category}
      onClose={handleCloseDialog}
      onSubmit={handleModify}
      open={dialogOpen}
      title='Modify Category'
    />
  );
};

export default ModifyAccountCategoryDialog;
