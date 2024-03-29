import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import currency from 'currency-codes';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import fromNow from 'common/utils/fromNow';
import ledgerPropTypes from '../utils/ledger-prop-types';
import LedgerActions from './LedgerActions';

const LedgersTable = ({ ledgers, mobile, onSelect }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Currency</TableCell>
        {!mobile && <TableCell>Last Modified</TableCell>}
        <TableCell>Actions</TableCell>
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
          {!mobile && <TableCell>{fromNow(moment.utc(ledger.lastUpdated))}</TableCell>}
          <TableCell onClick={(e) => e.stopPropagation()}>
            <LedgerActions ledger={ledger} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

LedgersTable.propTypes = {
  ledgers: PropTypes.arrayOf(ledgerPropTypes).isRequired,
  mobile: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

LedgersTable.defaultProps = {
  mobile: false,
};

export default LedgersTable;
