import React from 'react';

import FormDialog from 'common/components/FormDialog';
import useCreateLedger from '../hooks/useCreateLedger';
import LedgerForm from './LedgerForm';

const initialValues = {
  name: '',
  currency: 840, // USD
};

const CreateLedgerDialog = () => {
  const { mutate } = useCreateLedger();
  return (
    <FormDialog
      actionText='Create'
      FormComponent={LedgerForm}
      initialValues={initialValues}
      onSubmit={mutate}
      title='Create Ledger'
      validationSchema={LedgerForm.validationSchema}
    />
  );
};

export default CreateLedgerDialog;
