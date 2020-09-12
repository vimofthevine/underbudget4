import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useMountEffect from '../../common/hooks/useMountEffect';
import { LEDGERS } from '../../common/utils/routes';
import getSelectedLedger from '../utils/getSelectedLedger';

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
