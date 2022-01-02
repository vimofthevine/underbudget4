import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import React from 'react';

import { ChildPageAppBar, RightIconButtons } from 'common/components/AppBar';
import formatDate from 'common/utils/formatDate';
import { accountReconciliationsRoute } from 'common/utils/routes';
import { useFetchAccount } from 'features/accounts';
import useConfirmToDeleteReconciliation from '../hooks/useConfirmToDeleteReconciliation';
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

  const handleDelete = useConfirmToDeleteReconciliation({
    ...reconciliation,
    id: reconciliationId,
    parentRoute,
  });

  const primaryActions = [
    {
      'aria-label': 'Delete reconciliation',
      disabled: !handleDelete,
      icon: <DeleteIcon />,
      onClick: handleDelete,
      text: 'Delete reconciliation',
    },
  ];

  return (
    <ChildPageAppBar
      back={parentRoute}
      prominent={prominent}
      rightButtons={<RightIconButtons primaryActions={primaryActions} />}
      title={title}
    />
  );
};

ReconciliationAppBar.propTypes = {
  prominent: PropTypes.bool.isRequired,
  reconciliationId: PropTypes.number.isRequired,
};

export default ReconciliationAppBar;
