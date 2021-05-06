import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

import FormDialog from '../../../common/components/FormDialog';
import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import useFetchAccount from '../../hooks/useFetchAccount';
import useModifyAccount from '../../hooks/useModifyAccount';
import AccountForm from '../AccountForm';

const ModifyAccountDialog = ({ onExitNavigateTo }) => {
  const navigate = useNavigateKeepingSearch();
  const { id } = useParams();
  const { data, isLoading } = useFetchAccount(
    { id },
    { onError: () => navigate(onExitNavigateTo) },
  );
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
      onExitNavigateTo={onExitNavigateTo}
      onSubmit={mutate}
      title='Modify Account'
      validationSchema={AccountForm.validationSchema}
    />
  );
};

ModifyAccountDialog.propTypes = {
  onExitNavigateTo: PropTypes.string,
};

ModifyAccountDialog.defaultProps = {
  onExitNavigateTo: '..',
};

export default ModifyAccountDialog;
