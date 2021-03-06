import React from 'react';

import ledgerPropTypes from '../../utils/ledger-prop-types';
import LedgerActionsButtons from '../LedgerActionsButtons';
import LedgerActionsMenu from '../LedgerActionsMenu';
import { useLedgerActions } from './useLedgerActions';

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
