import PropTypes from 'prop-types';
import React from 'react';

import FormDialog from 'common/components/FormDialog';
import useCreateAnnualExpense from '../../hooks/useCreateAnnualExpense';
import AnnualExpenseForm from '../AnnualExpenseForm';

const CreateAnnualExpenseDialog = ({ budgetId, periods }) => {
  const { mutate } = useCreateAnnualExpense(budgetId);
  return (
    <FormDialog
      actionText='Create'
      FormComponent={AnnualExpenseForm}
      formProps={{ periods }}
      initialValues={AnnualExpenseForm.initialValues}
      onSubmit={mutate}
      title='Create Annual Expense'
      validationSchema={AnnualExpenseForm.validationSchema}
    />
  );
};

CreateAnnualExpenseDialog.propTypes = {
  budgetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  periods: PropTypes.number.isRequired,
};

export default CreateAnnualExpenseDialog;
