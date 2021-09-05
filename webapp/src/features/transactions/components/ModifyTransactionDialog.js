import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

import FormDialog from 'common/components/FormDialog';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import useFetchTransaction from '../hooks/useFetchTransaction';
import useModifyTransaction from '../hooks/useModifyTransaction';
import TransactionForm from './TransactionForm';

const ModifyTransactionDialog = ({ onExitNavigateTo }) => {
  const navigate = useNavigateKeepingSearch();
  const { transactionId } = useParams();
  const { data, isLoading } = useFetchTransaction(
    { id: transactionId },
    { onError: () => navigate(onExitNavigateTo) },
  );
  const transaction = {
    ...TransactionForm.initialValues,
    ...data,
  };
  const { mutate } = useModifyTransaction();

  return (
    <FormDialog
      actionText='Save'
      enableReinitialize
      FormComponent={TransactionForm}
      initialValues={transaction}
      isLoading={isLoading}
      maxWidth='lg'
      onExitNavigateTo={onExitNavigateTo}
      onSubmit={(values, opts) => mutate([values, data], opts)}
      title='Modify Transaction'
      validate={TransactionForm.validate}
      validateOnChange={false}
      validationSchema={TransactionForm.validationSchema}
    />
  );
};

ModifyTransactionDialog.propTypes = {
  onExitNavigateTo: PropTypes.string,
};

ModifyTransactionDialog.defaultProps = {
  onExitNavigateTo: '..',
};

export default ModifyTransactionDialog;
