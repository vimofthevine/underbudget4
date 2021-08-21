import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

import FormDialog from 'common/components/FormDialog';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import useFetchAnnualExpense from 'budgets/hooks/useFetchAnnualExpense';
import useModifyAnnualExpense from 'budgets/hooks/useModifyAnnualExpense';
import AnnualExpenseForm from '../AnnualExpenseForm';

const ModifyAnnualExpenseDialog = ({ budgetId, onExitNavigateTo, periods }) => {
  const navigate = useNavigateKeepingSearch();
  const { expenseId } = useParams();
  const { data, isLoading } = useFetchAnnualExpense(
    { id: expenseId },
    { onError: () => navigate(onExitNavigateTo) },
  );
  const expense = {
    ...AnnualExpenseForm.initialValues,
    ...data,
  };
  const { mutate } = useModifyAnnualExpense(budgetId);

  return (
    <FormDialog
      actionText='Save'
      enableReinitialize
      FormComponent={AnnualExpenseForm}
      formProps={{ disableDetailsSwitch: true, periods }}
      initialValues={expense}
      isLoading={isLoading}
      onExitNavigateTo={onExitNavigateTo}
      onSubmit={mutate}
      title='Modify Annual Expense'
      validationSchema={AnnualExpenseForm.validationSchema}
    />
  );
};

ModifyAnnualExpenseDialog.propTypes = {
  budgetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onExitNavigateTo: PropTypes.string,
  periods: PropTypes.number.isRequired,
};

ModifyAnnualExpenseDialog.defaultProps = {
  onExitNavigateTo: '../..',
};

export default ModifyAnnualExpenseDialog;
