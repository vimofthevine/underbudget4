import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

import FormDialog from 'common/components/FormDialog';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import useFetchPeriodicExpense from '../hooks/useFetchPeriodicExpense';
import useModifyPeriodicExpense from '../hooks/useModifyPeriodicExpense';
import PeriodicExpenseForm from './PeriodicExpenseForm';

const ModifyPeriodicExpenseDialog = ({ budgetId, onExitNavigateTo }) => {
  const navigate = useNavigateKeepingSearch();
  const { expenseId } = useParams();
  const { data, isLoading } = useFetchPeriodicExpense(
    { id: expenseId },
    { onError: () => navigate(onExitNavigateTo) },
  );
  const expense = {
    ...PeriodicExpenseForm.initialValues,
    ...data,
  };
  const { mutate } = useModifyPeriodicExpense(budgetId);

  return (
    <FormDialog
      actionText='Save'
      enableReinitialize
      FormComponent={PeriodicExpenseForm}
      initialValues={expense}
      isLoading={isLoading}
      onExitNavigateTo={onExitNavigateTo}
      onSubmit={mutate}
      title='Modify Periodic Expense'
      validationSchema={PeriodicExpenseForm.validationSchema}
    />
  );
};

ModifyPeriodicExpenseDialog.propTypes = {
  budgetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onExitNavigateTo: PropTypes.string,
};

ModifyPeriodicExpenseDialog.defaultProps = {
  onExitNavigateTo: '../..',
};

export default ModifyPeriodicExpenseDialog;
