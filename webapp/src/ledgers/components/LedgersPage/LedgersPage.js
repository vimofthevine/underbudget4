import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';

import FullAppPage from '../../../common/components/FullAppPage';
import CreateDemoLedgerDialog from '../CreateDemoLedgerDialog';
import CreateLedgerDialog from '../CreateLedgerDialog';
import { useLedgersDispatch } from '../LedgersContext';
import LedgersListing from '../LedgersListing';
import ModifyLedgerDialog from '../ModifyLedgerDialog';

const LedgersPage = () => {
  const dispatch = useLedgersDispatch();

  const createLedger = {
    'aria-label': 'Create ledger',
    fabIcon: <AddIcon />,
    icon: <AddCircleIcon />,
    onClick: () => dispatch({ type: 'showCreateLedger' }),
    text: 'Create ledger',
  };

  const createDemo = {
    'aria-label': 'Create demo',
    icon: <AddCircleIcon />,
    onClick: () => dispatch({ type: 'showCreateDemoLedger' }),
    text: 'Create demo',
  };

  return (
    <FullAppPage primaryActions={createLedger} secondaryActions={createDemo} title='Ledgers' useFab>
      <LedgersListing />
      <CreateDemoLedgerDialog />
      <CreateLedgerDialog />
      <ModifyLedgerDialog />
    </FullAppPage>
  );
};

export default LedgersPage;
