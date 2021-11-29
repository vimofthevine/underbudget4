import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import usePromptToLeave from 'common/hooks/usePromptToLeave';
import routePropType from 'common/utils/route-prop-type';
import useCreateReconciliation from '../hooks/useCreateReconciliation';
import ReconciliationForm from './ReconciliationForm';

const CreateReconciliationForm = ({ accountId, parentRoute }) => {
  const navigate = usePromptToLeave();
  const { mutate } = useCreateReconciliation({ accountId });
  const handleSubmit = (values, { setSubmitting }) =>
    mutate(values, {
      onSettled: () => setSubmitting(false),
      onSuccess: () => navigate(parentRoute),
    });

  return (
    <Formik
      initialValues={ReconciliationForm.initialValues}
      onSubmit={handleSubmit}
      validate={ReconciliationForm.validate}
      validationSchema={ReconciliationForm.validationSchema}
    >
      <Form>
        <ReconciliationForm accountId={accountId} />
      </Form>
    </Formik>
  );
};

CreateReconciliationForm.propTypes = {
  accountId: PropTypes.number.isRequired,
  parentRoute: routePropType.isRequired,
};

export default CreateReconciliationForm;
