import AddCircleIcon from '@material-ui/icons/AddCircle';
import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router';

import { ChildPageAppBar, RightIconButtons } from 'common/components/AppBar';
import useNavigateKeepingSearch from 'common/hooks/useNavigateKeepingSearch';
import { accountRoute, createReconciliationRoute } from 'common/utils/routes';
import { useFetchAccount } from 'features/accounts';

const AccountReconciliationsAppBar = ({ accountId, prominent }) => {
  const location = useLocation();
  const navigate = useNavigateKeepingSearch();

  const parentRoute = accountRoute(accountId);
  const createRoute = createReconciliationRoute(accountId);
  const handleCreateReconciliation = () => navigate(createRoute, { state: { from: location } });

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
