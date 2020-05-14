import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import currency from 'currency-codes';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

const LedgersTable = ({ ledgers, mobile, onSelect }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Currency</TableCell>
        {!mobile && <TableCell>Last Modified</TableCell>}
      </TableRow>
    </TableHead>
    <TableBody>
      {ledgers.map((ledger) => (
        <TableRow
          hover
          key={ledger.id}
          onClick={() => onSelect(ledger)}
          style={{ cursor: 'pointer' }}
        >
          <TableCell component='th' scope='row'>
            {ledger.name}
          </TableCell>
          <TableCell>{currency.number(ledger.currency).code}</TableCell>
          {!mobile && <TableCell>{moment(ledger.lastModified).fromNow()}</TableCell>}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

LedgersTable.propTypes = {
  ledgers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      currency: PropTypes.number.isRequired,
      lastModified: PropTypes.string.isRequired,
    }),
  ).isRequired,
  mobile: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

LedgersTable.defaultProps = {
  mobile: false,
};

export default LedgersTable;
