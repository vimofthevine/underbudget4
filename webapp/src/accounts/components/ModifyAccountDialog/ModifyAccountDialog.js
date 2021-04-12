import React from 'react';
import { useParams } from 'react-router-dom';

import FormDialog from '../../../common/components/FormDialog';
import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import useFetchAccount from '../../hooks/useFetchAccount';
import useModifyAccount from '../../hooks/useModifyAccount';
import AccountForm from '../AccountForm';

const ModifyAccountDialog = () => {
  const navigate = useNavigateKeepingSearch();
  const { id } = useParams();
  const { data, isLoading } = useFetchAccount({ id }, { onError: () => navigate('../../') });
  const category = {
    ...AccountForm.initialValues,
    ...data,
  };
  const { mutate } = useModifyAccount();

  return (
    <FormDialog
      actionText='Save'
      enableReinitialize
      FormComponent={AccountForm}
      initialValues={category}
      isLoading={isLoading}
      onExitNavigateTo='../../'
      onSubmit={mutate}
      title='Modify Account'
      validationSchema={AccountForm.validationSchema}
    />
  );
};

export default ModifyAccountDialog;
