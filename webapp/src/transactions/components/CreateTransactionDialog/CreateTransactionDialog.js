import React from 'react';

import FormDialog from 'common/components/FormDialog';
import TransactionForm from '../TransactionForm';

const CreateTransactionDialog = () => {
  const mutate = (values) => console.log(values);
  return (
    <FormDialog
      actionText='Create'
      FormComponent={TransactionForm}
      initialValues={TransactionForm.initialValues}
      onSubmit={mutate}
      title='Create Transaction'
      validationSchema={TransactionForm.validationSchema}
    />
  );
};

export default CreateTransactionDialog;
