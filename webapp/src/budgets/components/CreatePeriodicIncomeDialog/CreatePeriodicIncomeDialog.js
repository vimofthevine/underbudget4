import PropTypes from 'prop-types';
import React from 'react';

import FormDialog from 'common/components/FormDialog';
import useCreatePeriodicIncome from '../../hooks/useCreatePeriodicIncome';
import PeriodicIncomeForm from '../PeriodicIncomeForm';

const CreatePeriodicIncomeDialog = ({ budgetId }) => {
  const { mutate } = useCreatePeriodicIncome(budgetId);
  return (
    <FormDialog
      actionText='Create'
      FormComponent={PeriodicIncomeForm}
      initialValues={PeriodicIncomeForm.initialValues}
      onSubmit={mutate}
      title='Create Periodic Income'
      validationSchema={PeriodicIncomeForm.validationSchema}
    />
  );
};

CreatePeriodicIncomeDialog.propTypes = {
  budgetId: PropTypes.number.isRequired,
};

export default CreatePeriodicIncomeDialog;
