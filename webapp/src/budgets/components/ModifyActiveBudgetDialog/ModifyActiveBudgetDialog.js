import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

import FormDialog from 'common/components/FormDialog';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import useFetchActiveBudget from '../../hooks/useFetchActiveBudget';
import useModifyActiveBudget from '../../hooks/useModifyActiveBudget';
import ActiveBudgetForm from '../ActiveBudgetForm';

const formProps = {
  disableYear: true,
};

const ModifyActiveBudgetDialog = ({ onExitNavigateTo }) => {
  const navigate = useNavigateKeepingSearch();
  const { id } = useParams();
  const { data, isLoading } = useFetchActiveBudget(
    { id },
    { onError: () => navigate(onExitNavigateTo) },
  );
  const activeBudget = {
    ...ActiveBudgetForm.initialValues,
    ...data,
  };
  const { mutate } = useModifyActiveBudget();

  return (
    <FormDialog
      actionText='Save'
      enableReinitialize
      formProps={formProps}
      FormComponent={ActiveBudgetForm}
      initialValues={activeBudget}
      isLoading={isLoading}
      onExitNavigateTo={onExitNavigateTo}
      onSubmit={mutate}
      title='Modify Active Budget'
      validationSchema={ActiveBudgetForm.validationSchema}
    />
  );
};

ModifyActiveBudgetDialog.propTypes = {
  onExitNavigateTo: PropTypes.string,
};

ModifyActiveBudgetDialog.defaultProps = {
  onExitNavigateTo: '../..',
};

export default ModifyActiveBudgetDialog;
