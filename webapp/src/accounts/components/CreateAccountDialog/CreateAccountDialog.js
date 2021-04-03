import React from 'react';

import FormDialog from '../../../common/components/FormDialog';
import useCreateAccount from '../../hooks/useCreateAccount';
import AccountForm from '../AccountForm';

const CreateAccountDialog = () => {
  const { mutate } = useCreateAccount();
  return (
    <FormDialog
      actionText='Create'
      FormComponent={AccountForm}
      initialValues={AccountForm.initialValues}
      onSubmit={mutate}
      title='Create Account'
      validationSchema={AccountForm.validationSchema}
    />
  );
};

export default CreateAccountDialog;
