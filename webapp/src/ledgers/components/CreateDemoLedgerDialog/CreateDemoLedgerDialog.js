import currency from 'currency-codes';
import React from 'react';
import * as yup from 'yup';

import ResponsiveDialogForm from '../../../common/components/ResponsiveDialogForm';
import useCreateDemoLedger from '../../hooks/useCreateDemoLedger';
import DemoLedgerForm from '../DemoLedgerForm';
import { useLedgersDispatch, useLedgersState } from '../LedgersContext';

const initialValues = {
  name: '',
  currency: 840, // USD
  months: 3,
  seed: Math.floor(Math.random() * 1000 + 1), // 1-1000
};

const validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  currency: yup
    .number()
    .oneOf(
      currency.numbers().map((n) => Number(n)),
      'Must be a valid currency',
    )
    .required('Required'),
  months: yup.number().min(3).required('Required'),
  seed: yup.number().required('Required'),
});

const CreateDemoLedgerDialog = () => {
  const dispatch = useLedgersDispatch();
  const state = useLedgersState();

  const open = state.showCreateDemoLedger;
  const handleClose = () => dispatch({ type: 'hideCreateDemoLedger' });

  const { mutate } = useCreateDemoLedger({
    onSuccess: handleClose,
  });

  const handleSubmit = (values, { setSubmitting }) =>
    mutate(values, { onSettled: () => setSubmitting(false) });

  return (
    <ResponsiveDialogForm
      actionText='Create'
      FormComponent={DemoLedgerForm}
      initialValues={initialValues}
      onClose={handleClose}
      onSubmit={handleSubmit}
      open={open}
      title='Create Demo'
      validationSchema={validationSchema}
    />
  );
};

export default CreateDemoLedgerDialog;
