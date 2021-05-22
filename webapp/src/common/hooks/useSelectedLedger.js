import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useMountEffect from './useMountEffect';
import getSelectedLedger from '../utils/getSelectedLedger';
import { LEDGERS } from '../utils/routes';

export default function useSelectedLedger() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ledger] = React.useState(getSelectedLedger);

  useMountEffect(() => {
    if (!ledger) {
      navigate(LEDGERS, { state: { from: location } });
    }
  });

  return ledger;
}
