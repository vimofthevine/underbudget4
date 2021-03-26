import React from 'react';

import FormDialog from '../../../common/components/FormDialog';
import useCreateAccount from '../../hooks/useCreateAccount';
import AccountForm from '../AccountForm';

const initialValues = {
  name: '',
  category: 0,
  institution: '',
  accountNumber: '',
};

const CreateAccountDialog = () => {
  const { mutate } = useCreateAccount();
  return (
    <FormDialog
      actionText='Create'
      FormComponent={AccountForm}
      initialValues={initialValues}
      onSubmit={mutate}
      title='Create Account'
      validationSchema={AccountForm.validationSchema}
    />
  );
};

export default CreateAccountDialog;
