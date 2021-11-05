import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

import FormDialog from '../../../common/components/FormDialog';
import useNavigateKeepingSearch from '../../../common/hooks/useNavigateKeepingSearch';
import useFetchEnvelope from '../hooks/useFetchEnvelope';
import useModifyEnvelope from '../hooks/useModifyEnvelope';
import EnvelopeForm from './EnvelopeForm';

const ModifyEnvelopeDialog = ({ onExitNavigateTo }) => {
  const navigate = useNavigateKeepingSearch();
  const { id } = useParams();
  const { data, isLoading } = useFetchEnvelope(
    { id },
    { onError: () => navigate(onExitNavigateTo) },
  );
  const category = {
    ...EnvelopeForm.initialValues,
    ...data,
  };
  const { mutate } = useModifyEnvelope();

  return (
    <FormDialog
      actionText='Save'
      enableReinitialize
      FormComponent={EnvelopeForm}
      initialValues={category}
      isLoading={isLoading}
      onExitNavigateTo={onExitNavigateTo}
      onSubmit={mutate}
      title='Modify Envelope'
      validationSchema={EnvelopeForm.validationSchema}
    />
  );
};

ModifyEnvelopeDialog.propTypes = {
  onExitNavigateTo: PropTypes.string,
};

ModifyEnvelopeDialog.defaultProps = {
  onExitNavigateTo: '..',
};

export default ModifyEnvelopeDialog;
