import PropTypes from 'prop-types';
import React from 'react';

import FormDialog from 'common/components/FormDialog';
import useCreatePeriodicExpense from '../hooks/useCreatePeriodicExpense';
import PeriodicExpenseForm from './PeriodicExpenseForm';

const CreatePeriodicExpenseDialog = ({ budgetId }) => {
  const { mutate } = useCreatePeriodicExpense(budgetId);
  return (
    <FormDialog
      actionText='Create'
      FormComponent={PeriodicExpenseForm}
      initialValues={PeriodicExpenseForm.initialValues}
      onSubmit={mutate}
      title='Create Periodic Expense'
      validationSchema={PeriodicExpenseForm.validationSchema}
    />
  );
};

CreatePeriodicExpenseDialog.propTypes = {
  budgetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default CreatePeriodicExpenseDialog;
