import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

const TokensTable = ({ mobile, tokens }) => (
  <Table size={mobile ? 'small' : 'medium'}>
    <TableHead>
      <TableCell>Issued</TableCell>
      <TableCell>Source</TableCell>
      <TableCell>Actions</TableCell>
    </TableHead>
    <TableBody>
      {tokens.map((token) => (
        <TableRow key={token.jwtId}>
          <TableCell component='th' scope='row'>
            {moment(token.issued).fromNow()}
          </TableCell>
          <TableCell>{token.source}</TableCell>
          <TableCell>Delete</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

TokensTable.propTypes = {
  mobile: PropTypes.bool,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      issued: PropTypes.string.isRequired,
      jwtId: PropTypes.string.isRrequired,
      source: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

TokensTable.defaultProps = {
  mobile: false,
};

export default TokensTable;
