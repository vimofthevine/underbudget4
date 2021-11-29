import React from 'react';

import useResponsiveComponent from 'common/hooks/useResponsiveComponent';
import SelectableTransactionsList from './SelectableTransactionsList';
import SelectableTransactionsTable from './SelectableTransactionsTable';

const SelectableTransactions = (props) => {
  const Component = useResponsiveComponent({
    desktop: SelectableTransactionsTable,
    mobile: SelectableTransactionsList,
  });
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...props} />;
};

SelectableTransactions.propTypes = SelectableTransactionsTable.propTypes;

export default SelectableTransactions;
