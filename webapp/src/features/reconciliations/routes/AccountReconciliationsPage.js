import React from 'react';
import { useParams } from 'react-router-dom';

import AppPage from 'common/components/AppPage';
import AccountReconciliationsAppBar from '../components/AccountReconciliationsAppBar';

const AccountReconciliationsPage = () => {
  const { id } = useParams();
  const accountId = parseInt(id, 10);

  return (
    <AppPage appBar={<AccountReconciliationsAppBar accountId={accountId} />}>{accountId}</AppPage>
  );
};

export default AccountReconciliationsPage;
