import AddIcon from '@material-ui/icons/Add';
import React from 'react';

import Fab from '../../common/Fab';
import { useLedgersDispatch } from '../LedgersContext';

const CreateLedgerButton = () => {
  const dispatch = useLedgersDispatch();
  return (
    <Fab aria-label='Create ledger' onClick={() => dispatch({ type: 'showCreateLedger' })}>
      <AddIcon />
    </Fab>
  );
};

export default CreateLedgerButton;
