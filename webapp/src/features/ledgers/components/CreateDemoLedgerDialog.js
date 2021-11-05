import React from 'react';

import FormDialog from 'common/components/FormDialog';
import useCreateDemoLedger from '../hooks/useCreateDemoLedger';
import DemoLedgerForm from './DemoLedgerForm';

const initialValues = {
  name: '',
  currency: 840, // USD
  months: 3,
  seed: Math.floor(Math.random() * 1000 + 1), // 1-1000
};

const CreateDemoLedgerDialog = () => {
  const { mutate } = useCreateDemoLedger();
  return (
    <FormDialog
      actionText='Create'
      FormComponent={DemoLedgerForm}
      initialValues={initialValues}
      onSubmit={mutate}
      title='Create Demo'
      validationSchema={DemoLedgerForm.validationSchema}
    />
  );
};

export default CreateDemoLedgerDialog;
