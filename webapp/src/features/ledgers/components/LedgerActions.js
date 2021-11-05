import React from 'react';

import { useLedgerActions } from '../hooks/useLedgerActions';
import ledgerPropTypes from '../utils/ledger-prop-types';
import LedgerActionsButtons from './LedgerActionsButtons';
import LedgerActionsMenu from './LedgerActionsMenu';

const LedgerActions = ({ ledger }) => {
  const { handleDelete, handleModify, mobile } = useLedgerActions(ledger);
  return mobile ? (
    <LedgerActionsMenu onDelete={handleDelete} onModify={handleModify} />
  ) : (
    <LedgerActionsButtons onDelete={handleDelete} onModify={handleModify} />
  );
};

LedgerActions.propTypes = {
  ledger: ledgerPropTypes.isRequired,
};

export default LedgerActions;
