import React from 'react';
import PropTypes from 'prop-types';

import FormDialog from 'common/components/FormDialog';
import useCreateTransaction from '../hooks/useCreateTransaction';
import TransactionForm from './TransactionForm';

const CreateTransactionDialog = ({ initialAccountId, initialEnvelopeId }) => {
  const { mutate } = useCreateTransaction();
  const initialValues = React.useMemo(
    () => ({
      ...TransactionForm.initialValues,
      accountTransactions: [
        {
          ...TransactionForm.initialValues.accountTransactions[0],
          accountId: initialAccountId,
        },
      ],
      envelopeTransactions: [
        {
          ...TransactionForm.initialValues.envelopeTransactions[0],
          envelopeId: initialEnvelopeId,
        },
      ],
    }),
    [initialAccountId, initialEnvelopeId],
  );

  return (
    <FormDialog
      actionText='Create'
      FormComponent={TransactionForm}
      initialValues={initialValues}
      maxWidth='lg'
      onSubmit={mutate}
      title='Create Transaction'
      validate={TransactionForm.validate}
      validateOnChange={false}
      validationSchema={TransactionForm.validationSchema}
    />
  );
};

CreateTransactionDialog.propTypes = {
  initialAccountId: PropTypes.number,
  initialEnvelopeId: PropTypes.number,
};

CreateTransactionDialog.defaultProps = {
  initialAccountId: 0,
  initialEnvelopeId: 0,
};

export default CreateTransactionDialog;
