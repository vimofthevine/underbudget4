import React from 'react';
import { useParams } from 'react-router-dom';

import AppPage from 'common/components/AppPage';
import useMobile from 'common/hooks/useMobile';
import ReconciledTransactions from '../components/ReconciledTransactions';
import ReconciliationAppBar from '../components/ReconciliationAppBar';

const ReconciliationPage = () => {
  const mobile = useMobile();
  const { id } = useParams();
  const reconciliationId = parseInt(id, 10);

  return (
    <AppPage
      appBar={<ReconciliationAppBar prominent={mobile} reconciliationId={reconciliationId} />}
      prominent={mobile}
    >
      <ReconciledTransactions reconciliationId={reconciliationId} />
    </AppPage>
  );
};

export default ReconciliationPage;
