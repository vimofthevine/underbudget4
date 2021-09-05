import React from 'react';

import FormDialog from 'common/components/FormDialog';
import useCreateBudget from '../hooks/useCreateBudget';
import BudgetForm from './BudgetForm';

const CreateBudgetDialog = () => {
  const { mutate } = useCreateBudget();
  return (
    <FormDialog
      actionText='Create'
      FormComponent={BudgetForm}
      initialValues={BudgetForm.initialValues}
      onSubmit={mutate}
      title='Create Budget'
      validationSchema={BudgetForm.validationSchema}
    />
  );
};

export default CreateBudgetDialog;
