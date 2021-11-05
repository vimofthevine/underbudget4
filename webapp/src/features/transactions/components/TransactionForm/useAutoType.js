import { useFormikContext } from 'formik';
import React from 'react';

import { testIfType, typesByGroup } from '../../utils/transaction-types';

export default function useAutoType() {
  const {
    values: { accountTransactions, envelopeTransactions, type },
    setFieldValue,
  } = useFormikContext();

  React.useEffect(() => {
    const accountSum = accountTransactions
      ? accountTransactions.reduce((sum, trn) => sum + trn.amount, 0)
      : 0;

    if (accountSum > 0) {
      if (!testIfType.isIncome(type)) {
        setFieldValue('type', typesByGroup.income[0]);
      }
    } else if (accountSum < 0) {
      if (!testIfType.isExpense(type)) {
        setFieldValue('type', typesByGroup.expense[0]);
      }
    } else if (accountTransactions.length === 0) {
      if (!testIfType.isAllocation(type)) {
        setFieldValue('type', typesByGroup.allocation[0]);
      }
    } else if (envelopeTransactions.length === 0) {
      if (!testIfType.isTransfer(type)) {
        setFieldValue('type', typesByGroup.transfer[0]);
      }
    }
  }, [accountTransactions, envelopeTransactions, setFieldValue, type]);
}
