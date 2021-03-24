import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import useMobile from '../../../common/hooks/useMobile';

const LedgerPagination = ({ count }) => {
  const [searchParams, setSearchParams] = useSearchParams({ page: 1, size: 10 });
  const mobile = useMobile();

  const page = searchParams.get('page');
  const size = searchParams.get('size');

  const handleChangePage = (e, newPage) =>
    setSearchParams({
      page: newPage + 1, // TablePagination is 0-based
      size,
    });

  const handleChangeRowsPerPage = (e) =>
    setSearchParams({
      page: 1,
      size: parseInt(e.target.value, 10),
    });

  return (
    <TablePagination
      component='div'
      count={count}
      labelRowsPerPage={mobile ? null : 'Ledgers per page'}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      page={page - 1} // zero-based
      rowsPerPage={size}
    />
  );
};

LedgerPagination.propTypes = {
  count: PropTypes.number.isRequired,
};

export default LedgerPagination;
