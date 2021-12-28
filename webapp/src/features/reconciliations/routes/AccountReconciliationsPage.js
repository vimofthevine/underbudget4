import React from 'react';
import { useParams } from 'react-router-dom';

import AppPage from 'common/components/AppPage';
import useMobile from 'common/hooks/useMobile';
import AccountReconciliationsAppBar from '../components/AccountReconciliationsAppBar';
import AccountReconciliationsList from '../components/AccountReconciliationsList';

const AccountReconciliationsPage = () => {
  const mobile = useMobile();
  const { id } = useParams();
  const accountId = parseInt(id, 10);

  return (
    <AppPage
      appBar={<AccountReconciliationsAppBar accountId={accountId} prominent={mobile} />}
      prominent={mobile}
    >
      <AccountReconciliationsList accountId={accountId} />
    </AppPage>
  );
};

export default AccountReconciliationsPage;
