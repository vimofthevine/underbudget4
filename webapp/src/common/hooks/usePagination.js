import Pagination from '@material-ui/core/TablePagination';
import React from 'react';

import useMobile from './useMobile';

export default ({ defaultSize = 25, label = 'Rows per page' } = {}) => {
  const mobile = useMobile();
  const [{ page, size }, setPagination] = React.useState({ page: 0, size: defaultSize });

  const handleChangePage = (e, newPage) => setPagination({ page: newPage, size });
  const handleChangeRowsPerPage = (e) =>
    setPagination({ page: 0, size: parseInt(e.target.value, 10) });

  const paginationProps = {
    component: 'div',
    labelRowsPerPage: mobile ? null : label,
    onChangePage: handleChangePage,
    onChangeRowsPerPage: handleChangeRowsPerPage,
    page,
    rowsPerPage: size,
  };

  return {
    Pagination,
    paginationProps,
    page,
    size,
  };
};
