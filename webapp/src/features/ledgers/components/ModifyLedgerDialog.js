import React from 'react';
import { useParams } from 'react-router-dom';

import FormDialog from 'common/components/FormDialog';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import useFetchLedger from '../hooks/useFetchLedger';
import useModifyLedger from '../hooks/useModifyLedger';
import LedgerForm from './LedgerForm';

const noLedger = {
  name: '',
  currency: 0,
};

const ModifyLedgerDialog = () => {
  const navigate = useNavigateKeepingSearch();
  const { id } = useParams();
  const { data } = useFetchLedger(
    { id },
    {
      onError: () => navigate('../../'),
    },
  );
  const ledger = data || noLedger;
  const { mutate } = useModifyLedger();

  return (
    <FormDialog
      actionText='Save'
      enableReinitialize
      FormComponent={LedgerForm}
      initialValues={ledger}
      onExitNavigateTo='../../'
      onSubmit={mutate}
      title='Modify Ledger'
      validationSchema={LedgerForm.validationSchema}
    />
  );
};

export default ModifyLedgerDialog;
