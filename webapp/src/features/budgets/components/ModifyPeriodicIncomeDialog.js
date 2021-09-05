import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

import FormDialog from 'common/components/FormDialog';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import useFetchPeriodicIncome from '../hooks/useFetchPeriodicIncome';
import useModifyPeriodicIncome from '../hooks/useModifyPeriodicIncome';
import PeriodicIncomeForm from './PeriodicIncomeForm';

const ModifyPeriodicIncomeDialog = ({ budgetId, onExitNavigateTo }) => {
  const navigate = useNavigateKeepingSearch();
  const { incomeId } = useParams();
  const { data, isLoading } = useFetchPeriodicIncome(
    { id: incomeId },
    { onError: () => navigate(onExitNavigateTo) },
  );
  const income = {
    ...PeriodicIncomeForm.initialValues,
    ...data,
  };
  const { mutate } = useModifyPeriodicIncome(budgetId);

  return (
    <FormDialog
      actionText='Save'
      enableReinitialize
      FormComponent={PeriodicIncomeForm}
      initialValues={income}
      isLoading={isLoading}
      onExitNavigateTo={onExitNavigateTo}
      onSubmit={mutate}
      title='Modify Periodic Income'
      validationSchema={PeriodicIncomeForm.validationSchema}
    />
  );
};

ModifyPeriodicIncomeDialog.propTypes = {
  budgetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onExitNavigateTo: PropTypes.string,
};

ModifyPeriodicIncomeDialog.defaultProps = {
  onExitNavigateTo: '../..',
};

export default ModifyPeriodicIncomeDialog;
