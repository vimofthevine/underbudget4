import { Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';

import FullAppPage from '../../../common/components/FullAppPage';
import useMobile from '../../../common/hooks/useMobile';
import CreateLedgerDialog from '../CreateLedgerDialog';
import { useLedgersDispatch } from '../LedgersContext';
import LedgersListing from '../LedgersListing';
import ModifyLedgerDialog from '../ModifyLedgerDialog';

const LedgersPage = () => {
  const mobile = useMobile();
  const dispatch = useLedgersDispatch();

  const createLedger = {
    'aria-label': 'Create ledger',
    icon: <AddIcon />,
    onClick: () => dispatch({ type: 'showCreateLedger' }),
    text: 'Create ledger',
  };

  return (
    <FullAppPage primaryActions={createLedger} title='My Ledgers' useFab>
      {mobile && <LedgersListing />}
      {!mobile && (
        <Paper>
          <LedgersListing />
        </Paper>
      )}
      <CreateLedgerDialog />
      <ModifyLedgerDialog />
    </FullAppPage>
  );
};

export default LedgersPage;
