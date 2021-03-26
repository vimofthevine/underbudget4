import React from 'react';

import FormDialog from '../../../common/components/FormDialog';
import useCreateAccountCategory from '../../hooks/useCreateAccountCategory';
import AccountCategoryForm from '../AccountCategoryForm';

const initialValues = {
  name: '',
};

const CreateAccountCategoryDialog = () => {
  const { mutate } = useCreateAccountCategory();
  return (
    <FormDialog
      actionText='Create'
      disableFullScreen
      FormComponent={AccountCategoryForm}
      initialValues={initialValues}
      onSubmit={mutate}
      title='Create Category'
      validationSchema={AccountCategoryForm.validationSchema}
    />
  );
};

export default CreateAccountCategoryDialog;
