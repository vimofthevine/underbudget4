import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from 'react';

import useErrorMessage from 'common/hooks/useErrorMessage';
import usePagination from 'common/hooks/usePagination';
import { SelectableTransactions } from 'features/transactions';
import useFetchUnreconciledTransactions from '../hooks/useFetchUnreconciledTransactions';

const UnreconciledTransactions = ({ accountId, onSelect, selected }) => {
  const { Pagination, paginationProps, page, size } = usePagination({
    label: 'Transactions per page',
  });

  const { data, error, isError, isFetching, isLoading } = useFetchUnreconciledTransactions({
    accountId,
    page,
    size,
  });
  const count = data ? data.total : 0;
  const transactions = data ? data.transactions : [];

  const createErrorMessage = useErrorMessage({ request: 'Unable to retrieve transactions' });
  const errorMessage = createErrorMessage(error);

  const selectedIds = React.useMemo(() => selected.map((t) => t.id), [selected]);

  const handleSelect = (trn) => {
    if (selectedIds.indexOf(trn.id) !== -1) {
      onSelect(selected.filter((t) => t.id !== trn.id));
    } else {
      onSelect([...selected, trn]);
    }
  };

  const handleSelectAll = (checked, toSelect) => {
    if (checked) {
      const toBeAdded = toSelect.filter((t) => selectedIds.indexOf(t.id) === -1);
      onSelect([...selected, ...toBeAdded]);
    } else {
      const toBeRemoved = toSelect.map((t) => t.id);
      onSelect(selected.filter((t) => toBeRemoved.indexOf(t.id) === -1));
    }
  };

  return (
    <>
      <SelectableTransactions
        loading={isLoading}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        selected={selectedIds}
        transactions={transactions}
      />
      {isFetching && <LinearProgress />}
      {isError && <Alert severity='error'>{errorMessage}</Alert>}
      {count > size && <Pagination {...paginationProps} count={count} />}
    </>
  );
};

UnreconciledTransactions.propTypes = {
  accountId: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ).isRequired,
};

export default UnreconciledTransactions;
