import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import getSelectedLedger from '../utils/getSelectedLedger';
import { ACCOUNTS } from '../utils/routes';

export default function useSelectedLedger() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ledger] = React.useState(getSelectedLedger);

  React.useEffect(() => {
    if (!ledger) {
      navigate(ACCOUNTS, { state: { from: location } });
    }
  }, []);

  return ledger;
}
