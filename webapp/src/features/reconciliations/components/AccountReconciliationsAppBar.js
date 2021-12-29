import AddCircleIcon from '@material-ui/icons/AddCircle';
import PropTypes from 'prop-types';
import React from 'react';

import { ChildPageAppBar, RightIconButtons } from 'common/components/AppBar';
import { accountRoute } from 'common/utils/routes';
import { useFetchAccount } from 'features/accounts';
import useNavigateToCreateReconciliation from '../hooks/useNavigateToCreateReconciliation';

const AccountReconciliationsAppBar = ({ accountId, prominent }) => {
  const parentRoute = accountRoute(accountId);
  const handleCreateReconciliation = useNavigateToCreateReconciliation(accountId);

  const { data } = useFetchAccount({ id: accountId });
  const title = React.useMemo(() => {
    if (!data) {
      return '...';
    }
    return `${data.name} Reconciliations`;
  }, [data]);

  return (
    <ChildPageAppBar
      back={parentRoute}
      prominent={prominent}
      rightButtons={
        <RightIconButtons
          primaryActions={{
            'aria-label': 'Reconcile account',
            icon: <AddCircleIcon />,
            onClick: handleCreateReconciliation,
            text: 'Reconcile account',
          }}
        />
      }
      title={title}
    />
  );
};

AccountReconciliationsAppBar.propTypes = {
  accountId: PropTypes.number.isRequired,
  prominent: PropTypes.bool.isRequired,
};

export default AccountReconciliationsAppBar;
