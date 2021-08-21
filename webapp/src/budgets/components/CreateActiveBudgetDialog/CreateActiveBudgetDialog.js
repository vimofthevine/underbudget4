import React from 'react';

import FormDialog from 'common/components/FormDialog';
import useCreateActiveBudget from '../../hooks/useCreateActiveBudget';
import ActiveBudgetForm from '../ActiveBudgetForm';

const CreateActiveBudgetDialog = () => {
  const { mutate } = useCreateActiveBudget();
  return (
    <FormDialog
      actionText='Set'
      FormComponent={ActiveBudgetForm}
      initialValues={ActiveBudgetForm.initialValues}
      onSubmit={mutate}
      title='Set Active Budget'
      validationSchema={ActiveBudgetForm.validationSchema}
    />
  );
};

export default CreateActiveBudgetDialog;
