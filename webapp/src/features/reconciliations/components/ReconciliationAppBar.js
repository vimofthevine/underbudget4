import PropTypes from 'prop-types';
import React from 'react';

import { ChildPageAppBar } from 'common/components/AppBar';
import formatDate from 'common/utils/formatDate';
import { accountReconciliationsRoute } from 'common/utils/routes';
import { useFetchAccount } from 'features/accounts';
import useFetchReconciliation from '../hooks/useFetchReconciliation';

const ReconciliationAppBar = ({ reconciliationId, prominent }) => {
  const { data: reconciliation } = useFetchReconciliation({ id: reconciliationId });
  const { data: account } = useFetchAccount({ id: reconciliation?.accountId });

  const parentRoute = reconciliation ? accountReconciliationsRoute(reconciliation.accountId) : '/';
  const title = React.useMemo(() => {
    if (account && reconciliation) {
      return `${account.name} ${formatDate(reconciliation.beginningDate)} - ${formatDate(
        reconciliation.endingDate,
      )}`;
    }
    return '...';
  }, [account, reconciliation]);

  return <ChildPageAppBar back={parentRoute} prominent={prominent} title={title} />;
};

ReconciliationAppBar.propTypes = {
  prominent: PropTypes.bool.isRequired,
  reconciliationId: PropTypes.number.isRequired,
};

export default ReconciliationAppBar;
