import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import FullAppPage from '../../../common/components/FullAppPage';
import useConfirmation from '../../../common/hooks/useConfirmation';
import useLedgers from '../../hooks/useLedgers';
import CreateDemoLedgerDialog from '../CreateDemoLedgerDialog';
import CreateLedgerDialog from '../CreateLedgerDialog';
import { useLedgersState } from '../LedgersContext';
import LedgersListing from '../LedgersListing';
import ModifyLedgerDialog from '../ModifyLedgerDialog';

const AskToCreateDemo = ({ hasAsked, setHasAsked }) => {
  const navigate = useNavigate();
  const confirm = useConfirmation();
  const state = useLedgersState();
  const { data } = useLedgers(state.pagination);

  React.useEffect(() => {
    if (!hasAsked) {
      if (data && data.total === 0) {
        setHasAsked(true);
        confirm({
          message: 'You have no ledgers. Would you like to create a demo ledger?',
        }).then(() => {
          navigate('create-demo');
        });
      }
    }
  }, [data, hasAsked, setHasAsked]);

  return null;
};

const LedgersPage = () => {
  const navigate = useNavigate();
  const [hasAsked, setHasAsked] = React.useState(false);

  const createLedger = {
    'aria-label': 'Create ledger',
    fabIcon: <AddIcon />,
    icon: <AddCircleIcon />,
    onClick: () => navigate('create'),
    text: 'Create ledger',
  };

  const createDemo = {
    'aria-label': 'Create demo',
    icon: <AddCircleIcon />,
    onClick: () => navigate('create-demo'),
    text: 'Create demo',
  };

  return (
    <FullAppPage primaryActions={createLedger} secondaryActions={createDemo} title='Ledgers' useFab>
      <LedgersListing />
      <Routes>
        <Route path='create' element={<CreateLedgerDialog />} />
        <Route path='create-demo' element={<CreateDemoLedgerDialog />} />
        <Route path='modify/:id' element={<ModifyLedgerDialog />} />
        <Route
          path='/'
          element={<AskToCreateDemo hasAsked={hasAsked} setHasAsked={setHasAsked} />}
        />
      </Routes>
    </FullAppPage>
  );
};

export default LedgersPage;
