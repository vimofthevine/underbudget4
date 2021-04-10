import React from 'react';
import { useParams } from 'react-router-dom';

import FormDialog from '../../../common/components/FormDialog';
import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import useFetchEnvelopeCategory from '../../hooks/useFetchEnvelopeCategory';
import useModifyEnvelopeCategory from '../../hooks/useModifyEnvelopeCategory';
import EnvelopeCategoryForm from '../EnvelopeCategoryForm';

const ModifyEnvelopeCategoryDialog = () => {
  const navigate = useNavigateKeepingSearch();
  const { id } = useParams();
  const { data, isLoading } = useFetchEnvelopeCategory(
    { id },
    { onError: () => navigate('../../') },
  );
  const category = data || EnvelopeCategoryForm.initialValues;
  const { mutate } = useModifyEnvelopeCategory();

  return (
    <FormDialog
      actionText='Save'
      enableReinitialize
      FormComponent={EnvelopeCategoryForm}
      initialValues={category}
      isLoading={isLoading}
      onExitNavigateTo='../../'
      onSubmit={mutate}
      title='Modify Category'
      validationSchema={EnvelopeCategoryForm.validationSchema}
    />
  );
};

export default ModifyEnvelopeCategoryDialog;
