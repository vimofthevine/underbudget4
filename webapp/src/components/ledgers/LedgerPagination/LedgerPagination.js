import TablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import React from 'react';

import { useLedgersDispatch, useLedgersState } from '../LedgersContext';

const LedgerPagination = ({ count }) => {
  const dispatch = useLedgersDispatch();
  const state = useLedgersState();

  const handleChangePage = (e, page) =>
    dispatch({
      type: 'setPagination',
      payload: {
        ...state.pagination,
        page,
      },
    });

  const handleChangeRowsPerPage = (e) =>
    dispatch({
      type: 'setPagination',
      payload: {
        page: 0,
        size: parseInt(e.target.value, 10),
      },
    });

  return (
    <TablePagination
      component='div'
      count={count}
      labelRowsPerPage='Ledgers per page'
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      page={state.pagination.page}
      rowsPerPage={state.pagination.size}
    />
  );
};

LedgerPagination.propTypes = {
  count: PropTypes.number.isRequired,
};

export default LedgerPagination;
