import React from 'react';
import { useParams } from 'react-router-dom';

import FormDialog from '../../../common/components/FormDialog';
import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import useFetchAccountCategory from '../../hooks/useFetchAccountCategory';
import useModifyAccountCategory from '../../hooks/useModifyAccountCategory';
import AccountCategoryForm from '../AccountCategoryForm';

const noCategory = {
  name: '',
};

const ModifyAccountCategoryDialog = () => {
  const navigate = useNavigateKeepingSearch();
  const { id } = useParams();
  const { data, isLoading } = useFetchAccountCategory(
    { id },
    { onError: () => navigate('../../') },
  );
  const category = data || noCategory;
  const { mutate } = useModifyAccountCategory();

  return (
    <FormDialog
      actionText='Save'
      enableReinitialize
      FormComponent={AccountCategoryForm}
      initialValues={category}
      isLoading={isLoading}
      onExitNavigateTo='../../'
      onSubmit={mutate}
      title='Modify Category'
      validationSchema={AccountCategoryForm.validationSchema}
    />
  );
};

export default ModifyAccountCategoryDialog;
