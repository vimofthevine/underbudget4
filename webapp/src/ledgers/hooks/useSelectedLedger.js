import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ACCOUNTS } from '../../common/utils/routes';
import getSelectedLedger from '../utils/getSelectedLedger';

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
