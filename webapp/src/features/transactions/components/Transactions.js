import React from 'react';

import useResponsiveComponent from 'common/hooks/useResponsiveComponent';
import TransactionsList from './TransactionsList';
import TransactionsTable from './TransactionsTable';

const Transactions = (props) => {
  const Component = useResponsiveComponent({
    desktop: TransactionsTable,
    mobile: TransactionsList,
  });
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...props} />;
};

Transactions.propTypes = TransactionsTable.propTypes;

export default Transactions;
