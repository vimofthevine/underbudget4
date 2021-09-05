import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

import FormDialog from 'common/components/FormDialog';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import useFetchBudget from '../hooks/useFetchBudget';
import useModifyBudget from '../hooks/useModifyBudget';
import BudgetForm from './BudgetForm';

const ModifyBudgetDialog = ({ onExitNavigateTo }) => {
  const navigate = useNavigateKeepingSearch();
  const { id } = useParams();
  const { data, isLoading } = useFetchBudget({ id }, { onError: () => navigate(onExitNavigateTo) });
  const budget = {
    ...BudgetForm.initialValues,
    ...data,
  };
  const { mutate } = useModifyBudget();

  return (
    <FormDialog
      actionText='Save'
      enableReinitialize
      FormComponent={BudgetForm}
      initialValues={budget}
      isLoading={isLoading}
      onExitNavigateTo={onExitNavigateTo}
      onSubmit={mutate}
      title='Modify Budget'
      validationSchema={BudgetForm.validationSchema}
    />
  );
};

ModifyBudgetDialog.propTypes = {
  onExitNavigateTo: PropTypes.string,
};

ModifyBudgetDialog.defaultProps = {
  onExitNavigateTo: '..',
};

export default ModifyBudgetDialog;
