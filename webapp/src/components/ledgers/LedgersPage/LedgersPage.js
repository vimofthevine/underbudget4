import { Paper } from '@material-ui/core';
import React from 'react';

import useMobile from '../../../common/hooks/useMobile';
import AppPage from '../../common/AppPage';
import CreateLedgerButton from '../CreateLedgerButton';
import CreateLedgerDialog from '../CreateLedgerDialog';
import { LedgersContextProvider } from '../LedgersContext';
import LedgersListing from '../LedgersListing';
import ModifyLedgerDialog from '../ModifyLedgerDialog';

const LedgersPage = () => {
  const mobile = useMobile();
  return (
    <LedgersContextProvider>
      <AppPage fab title='My Ledgers'>
        {mobile && <LedgersListing />}
        {!mobile && (
          <Paper>
            <LedgersListing />
          </Paper>
        )}
        <CreateLedgerButton />
        <CreateLedgerDialog />
        <ModifyLedgerDialog />
      </AppPage>
    </LedgersContextProvider>
  );
};

export default LedgersPage;
