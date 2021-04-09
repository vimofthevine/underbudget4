import React from 'react';

import FormDialog from '../../../common/components/FormDialog';
import useCreateEnvelopeCategory from '../../hooks/useCreateEnvelopeCategory';
import EnvelopeCategoryForm from '../EnvelopeCategoryForm';

const CreateEnvelopeCategoryDialog = () => {
  const { mutate } = useCreateEnvelopeCategory();
  return (
    <FormDialog
      actionText='Create'
      disableFullScreen
      FormComponent={EnvelopeCategoryForm}
      initialValues={EnvelopeCategoryForm.initialValues}
      onSubmit={mutate}
      title='Create Category'
      validationSchema={EnvelopeCategoryForm.validationSchema}
    />
  );
};

export default CreateEnvelopeCategoryDialog;
