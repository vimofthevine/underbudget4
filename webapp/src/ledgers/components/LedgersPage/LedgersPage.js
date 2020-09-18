import AddCircleIcon from '@material-ui/icons/AddCircle';
import React from 'react';

import FullAppPage from '../../../common/components/FullAppPage';
import CreateLedgerDialog from '../CreateLedgerDialog';
import { useLedgersDispatch } from '../LedgersContext';
import LedgersListing from '../LedgersListing';
import ModifyLedgerDialog from '../ModifyLedgerDialog';

const LedgersPage = () => {
  const dispatch = useLedgersDispatch();

  const createLedger = {
    'aria-label': 'Create ledger',
    icon: <AddCircleIcon />,
    onClick: () => dispatch({ type: 'showCreateLedger' }),
    text: 'Create ledger',
  };

  return (
    <FullAppPage primaryActions={createLedger} title='My Ledgers' useFab>
      <LedgersListing />
      <CreateLedgerDialog />
      <ModifyLedgerDialog />
    </FullAppPage>
  );
};

export default LedgersPage;
