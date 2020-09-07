import PropTypes from 'prop-types';
import React from 'react';

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
  ledger: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default LedgerActions;
