import React from 'react';

import FormDialog from '../../../common/components/FormDialog';
import useCreateEnvelope from '../../hooks/useCreateEnvelope';
import EnvelopeForm from '../EnvelopeForm';

const CreateEnvelopeDialog = () => {
  const { mutate } = useCreateEnvelope();
  return (
    <FormDialog
      actionText='Create'
      FormComponent={EnvelopeForm}
      initialValues={EnvelopeForm.initialValues}
      onSubmit={mutate}
      title='Create Envelope'
      validationSchema={EnvelopeForm.validationSchema}
    />
  );
};

export default CreateEnvelopeDialog;
