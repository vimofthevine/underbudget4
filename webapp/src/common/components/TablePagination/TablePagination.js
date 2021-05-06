import MuiTablePagination from '@material-ui/core/TablePagination';
import PropTypes from 'prop-types';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import useMobile from '../../hooks/useMobile';

const TablePagination = ({ count, defaultSize, labelRowsPerPage }) => {
  const [searchParams, setSearchParams] = useSearchParams({ page: 1, size: defaultSize });
  const mobile = useMobile();

  const page = parseInt(searchParams.get('page'), 10);
  const size = parseInt(searchParams.get('size'), 10);

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
    <MuiTablePagination
      component='div'
      count={count}
      labelRowsPerPage={mobile ? null : labelRowsPerPage}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      page={page - 1} // zero-based
      rowsPerPage={size}
    />
  );
};

TablePagination.propTypes = {
  count: PropTypes.number.isRequired,
  defaultSize: PropTypes.number,
  labelRowsPerPage: PropTypes.string.isRequired,
};

TablePagination.defaultProps = {
  defaultSize: 10,
};

export default TablePagination;
